import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// このルートは token_hash 方式でメールのログインリンクを検証します。
// PKCE(コード交換)方式と違い、メール送信時と別のブラウザ・別の端末で
// リンクを開いても認証できるため、家族それぞれが別の端末で
// メールを開くケースに強い方式です。
// 有効にするには、Supabaseダッシュボードの
// Authentication → Email Templates → Magic Link のリンクを
// {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/library
// に変更してください（README参照）。

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/library";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      const redirectTo = request.nextUrl.clone();
      redirectTo.pathname = next;
      redirectTo.search = "";
      return NextResponse.redirect(redirectTo);
    }
  }

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/login";
  redirectTo.search = "";
  return NextResponse.redirect(redirectTo);
}
