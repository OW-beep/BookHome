import { type NextRequest, NextResponse } from "next/server";

// Xの投稿ではこの短いリンクだけを貼る運用にするための踏み台ルートです。
// 例: https://bookhome.jp/go/devlog1
//   → https://bookhome.jp/?utm_source=x&utm_medium=social&utm_campaign=devlog1 にリダイレクト
//
// GA4は着地ページ読み込み時のURLからutm_*を自動で拾って「参照元 / メディア」
// 「キャンペーン」として記録するので、これだけで投稿ごとの流入をGA4上で
// 見分けられるようになります（GA4側の追加設定は不要）。
//
// next クエリで着地先を変えられます:
//   /go/devlog1            → トップページ (/) に着地
//   /go/devlog1?next=/library → /library に着地（要ログイン等は各ページの挙動に従う）
//
// medium / source を変えたい場合（例: Instagramのbioリンクにも流用する等）は
// クエリで上書きできます: /go/devlog1?source=instagram&medium=social

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaign: string }> }
) {
  const { campaign } = await params;
  const { searchParams } = new URL(request.url);

  const next = searchParams.get("next") ?? "/";
  const source = searchParams.get("source") ?? "x";
  const medium = searchParams.get("medium") ?? "social";
  const content = searchParams.get("content"); // 任意: 同じ投稿でリンクを2箇所に貼る場合など

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.search = "";
  redirectTo.searchParams.set("utm_source", source);
  redirectTo.searchParams.set("utm_medium", medium);
  redirectTo.searchParams.set("utm_campaign", campaign);
  if (content) {
    redirectTo.searchParams.set("utm_content", content);
  }

  return NextResponse.redirect(redirectTo, { status: 302 });
}
