import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 絵本・児童書・図鑑ジャンルの楽天ブックスジャンルID
const CHILDRENS_BOOKS_GENRE_ID = "001003";

export async function GET() {
  const appId = process.env.RAKUTEN_APP_ID;

  if (!appId) {
    return NextResponse.json({ books: [], source: "fallback" });
  }

  try {
    const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;
    const params = new URLSearchParams({
      applicationId: appId,
      booksGenreId: CHILDRENS_BOOKS_GENRE_ID,
      sort: "sales",
      hits: "8",
      format: "json",
      formatVersion: "2",
    });
    if (affiliateId) params.set("affiliateId", affiliateId);

    const res = await fetch(
      `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ books: [], source: "fallback" });
    }

    const data = await res.json();
    const items = Array.isArray(data?.Items) ? data.Items : [];

    const books = items
      .filter((item: any) => item?.title)
      .slice(0, 8)
      .map((item: any) => ({
        title: item.title as string,
        author: (item.author as string) || null,
        imageUrl: (item.largeImageUrl || item.mediumImageUrl || null) as
          | string
          | null,
        url: (item.affiliateUrl || item.itemUrl) as string,
        isbn: (item.isbn as string) || null,
      }));

    return NextResponse.json({ books, source: "rakuten" });
  } catch {
    return NextResponse.json({ books: [], source: "fallback" });
  }
}
