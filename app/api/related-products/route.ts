import { NextRequest, NextResponse } from "next/server";
import https from "https";

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
    req.setTimeout(6000, () => req.destroy(new Error("timeout")));
  });
}

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword")?.trim();
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // 何か1つでも欠けていたら、静かに空を返す（このセクションは表示されなくなるだけ）
  if (!keyword || !appId || !accessKey || !siteUrl) {
    return NextResponse.json({ products: [] });
  }

  try {
    const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;
    const params = new URLSearchParams({
      applicationId: appId,
      accessKey,
      keyword: `${keyword} グッズ`,
      hits: "4",
      format: "json",
    });
    if (affiliateId) params.set("affiliateId", affiliateId);

    const url = `https://openapi.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params.toString()}`;

    const { status, body } = await httpsGetJson(url, {
      accessKey,
      Origin: siteUrl,
      Referer: siteUrl,
    });

    if (status !== 200) {
      return NextResponse.json({ products: [] });
    }

    const data = JSON.parse(body);
    const rawItems = Array.isArray(data?.Items) ? data.Items : [];

    const products = rawItems
      .map((entry: any) => entry?.Item ?? entry)
      .filter((item: any) => item?.itemName)
      .slice(0, 4)
      .map((item: any) => ({
        title: item.itemName as string,
        price: item.itemPrice as number,
        imageUrl: (item.mediumImageUrls?.[0]?.imageUrl || null) as
          | string
          | null,
        url: (item.affiliateUrl || item.itemUrl) as string,
      }));

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
