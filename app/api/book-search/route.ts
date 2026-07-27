import { NextRequest, NextResponse } from "next/server";
import { lookupOpenBD, lookupGoogleBooksByIsbn } from "@/lib/bookLookup";

type SearchResult = {
  isbn: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  cover_image_url: string | null;
};

type NdlItem = {
  title: string;
  isbn: string | null;
};

function parseNdlOpenSearch(xml: string): NdlItem[] {
  const items: NdlItem[] = [];
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  for (const block of itemBlocks) {
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    if (!titleMatch) continue;
    const title = titleMatch[1]
      .replace(/<!\[CDATA\[/g, "")
      .replace(/\]\]>/g, "")
      .trim();
    if (!title) continue;

    // description の先頭付近に "巻,出版社,年,ISBN" のような形式で入っていることが多い。
    // ISBNはハイフンあり/なし両方のパターンに対応する
    const descMatch = block.match(/<description>([\s\S]*?)<\/description>/);
    const descText = descMatch ? descMatch[1] : "";
    const isbnMatch = descText.match(/97[89][\d-]{10,17}|(\d{9}[\dXx])/);
    const isbn = isbnMatch ? isbnMatch[0].replace(/-/g, "").toUpperCase() : null;

    items.push({ title, isbn });
  }

  return items;
}

async function searchNdl(query: string): Promise<NdlItem[]> {
  try {
    const res = await fetch(
      `https://ndlsearch.ndl.go.jp/api/opensearch?title=${encodeURIComponent(
        query
      )}&cnt=10`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    return parseNdlOpenSearch(xml);
  } catch {
    return [];
  }
}

async function searchGoogleBooks(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=8&country=JP`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    return items
      .filter((item: any) => item?.volumeInfo?.title)
      .map((item: any) => {
        const info = item.volumeInfo;
        const isbn13 = info.industryIdentifiers?.find(
          (id: any) => id.type === "ISBN_13"
        )?.identifier;
        return {
          isbn: isbn13 || null,
          title: info.title,
          author: Array.isArray(info.authors) ? info.authors.join(", ") : null,
          publisher: info.publisher || null,
          cover_image_url: info.imageLinks?.thumbnail || null,
        };
      });
  } catch {
    return [];
  }
}

async function enrichByTitle(title: string): Promise<Partial<SearchResult> | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        `intitle:"${title}"`
      )}&maxResults=1&country=JP`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = data?.items?.[0];
    if (!item?.volumeInfo) return null;
    const info = item.volumeInfo;
    return {
      author: Array.isArray(info.authors) ? info.authors.join(", ") : null,
      publisher: info.publisher || null,
      cover_image_url: info.imageLinks?.thumbnail || null,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "検索キーワードが必要です" }, { status: 400 });
  }

  const ndlItems = await searchNdl(q);

  if (ndlItems.length > 0) {
    const top = ndlItems.slice(0, 6);

    const enriched = await Promise.all(
      top.map(async (item): Promise<SearchResult> => {
        if (item.isbn) {
          const looked = (await lookupOpenBD(item.isbn)) ?? (await lookupGoogleBooksByIsbn(item.isbn));
          if (looked) {
            return {
              isbn: item.isbn,
              title: looked.title || item.title,
              author: looked.author,
              publisher: looked.publisher,
              cover_image_url: looked.cover_image_url,
            };
          }
        }

        // ISBNが取れなかった、またはISBNからの詳細取得に失敗した場合は
        // タイトルでの補完検索を試みる（著者・表紙だけでも拾えることがある）
        const supplement = await enrichByTitle(item.title);
        return {
          isbn: item.isbn,
          title: item.title,
          author: supplement?.author ?? null,
          publisher: supplement?.publisher ?? null,
          cover_image_url: supplement?.cover_image_url ?? null,
        };
      })
    );

    // タイトルの重複を除去
    const seen = new Set<string>();
    const deduped = enriched.filter((r) => {
      if (seen.has(r.title)) return false;
      seen.add(r.title);
      return true;
    });

    return NextResponse.json({ results: deduped });
  }

  // NDLで見つからなければGoogle Booksにフォールバック（海外本など）
  const googleResults = await searchGoogleBooks(q);
  return NextResponse.json({ results: googleResults });
}
