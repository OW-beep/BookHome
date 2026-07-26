import { NextResponse } from "next/server";
import https from "https";

export const dynamic = "force-dynamic";

// 絵本・児童書・図鑑ジャンルの楽天ブックスジャンルID
const CHILDRENS_BOOKS_GENRE_ID = "001003";

// Node.jsのfetch()はWHATWG仕様に従い、Referer/OriginヘッダーをセットしてもExampleとして
// 黙って無視してしまう（禁止ヘッダーとして扱われるため）。楽天の新APIはReferer必須なので、
// 低レベルのhttpsモジュールを使って迂回する。
function httpsGetJson(
  url: string,
  headers: Record<string, string>
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () =>
        resolve({ status: res.statusCode || 0, body: data })
      );
    });
    req.on("error", reject);
    req.setTimeout(8000, () => {
      req.destroy(new Error("timeout"));
    });
  });
}

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

  if (!siteUrl) {
    return NextResponse.json({
      books: [],
      source: "fallback",
      reason:
        "NEXT_PUBLIC_SITE_URL が未設定です。楽天の新APIはRefererヘッダーが必須のため、この値が必要です",
    });
  }

  try {
    const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;
    const params = new URLSearchParams({
      applicationId: appId,
      accessKey,
      booksGenreId: CHILDRENS_BOOKS_GENRE_ID,
      hits: "8",
      format: "json",
      referrer: siteUrl,
      httpReferrer: siteUrl,
      origin: siteUrl,
    });
    if (affiliateId) params.set("affiliateId", affiliateId);

    const url = `https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404?${params.toString()}`;

    const { status, body } = await httpsGetJson(url, {
      accessKey,
      Origin: siteUrl,
      Referer: siteUrl,
    });

    if (status !== 200) {
      const sanitized = body
        .split(appId)
        .join("[APP_ID]")
        .split(accessKey)
        .join("[ACCESS_KEY]")
        .slice(0, 300);
      return NextResponse.json({
        books: [],
        source: "fallback",
        reason: `Rakuten APIエラー status=${status}: ${sanitized}`,
      });
    }

    const data = JSON.parse(body);
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
