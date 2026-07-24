import { NextRequest, NextResponse } from "next/server";

type SearchResult = {
  isbn: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  cover_image_url: string | null;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "検索キーワードが必要です" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        q
      )}&maxResults=8&country=JP`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }
    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    const results: SearchResult[] = items
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

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
