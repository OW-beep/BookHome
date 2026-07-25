import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 絵本・児童書・図鑑ジャンルの楽天ブックスジャンルID
const CHILDRENS_BOOKS_GENRE_ID = "001003";

export async function GET() {
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!appId || !accessKey) {
    return NextResponse.json({
      books: [],
      source: "fallback",
      reason: !appId
        ? "RAKUTEN_APP_ID が読み込めていません（未設定 or 未反映）"
        : "RAKUTEN_ACCESS_KEY が読み込めていません（2026年5月の楽天API仕様変更で追加で必要になりました）",
    });
  }

  try {
    const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;
    const params = new URLSearchParams({
      applicationId: appId,
      booksGenreId: CHILDRENS_BOOKS_GENRE_ID,
      hits: "8",
      format: "json",
    });
    if (affiliateId) params.set("affiliateId", affiliateId);

    const res = await fetch(
      `https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          accessKey,
          Origin: siteUrl || "",
          Referer: siteUrl || "",
        },
      }
    );

    if (!res.ok) {
      const bodyText = await res.text();
      const sanitized = bodyText
        .split(appId)
        .join("[APP_ID]")
        .split(accessKey)
        .join("[ACCESS_KEY]")
        .slice(0, 300);
      return NextResponse.json({
        books: [],
        source: "fallback",
        reason: `Rakuten APIエラー status=${res.status}: ${sanitized}`,
      });
    }

    const data = await res.json();
    const rawItems = Array.isArray(data?.Items) ? data.Items : [];

    const books = rawItems
      .map((entry: any) => entry?.Item ?? entry)
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
  } catch (err: any) {
    return NextResponse.json({
      books: [],
      source: "fallback",
      reason: `例外: ${err?.message ?? "unknown"}`,
    });
  }
}
