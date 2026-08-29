import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabaseの無料プランは、一定期間（目安7日間）プロジェクトへのAPIアクセスが
// 無いと、自動的にプロジェクトを一時停止する。Vercel Cronから毎日この
// エンドポイントを叩くことで、Supabaseへの軽いリクエストを発生させ続け、
// 一時停止を防ぐ。
//
// 実行スケジュールは vercel.json の "crons" 設定を参照。

export async function GET(request: NextRequest) {
  // Vercel Cronは Authorization: Bearer $CRON_SECRET を付けて呼び出す。
  // 環境変数 CRON_SECRET を設定している場合のみ検証する
  // （未設定でも動作はするが、誰でも叩けてしまうため本番では設定を推奨）。
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // クエリの中身・結果は使わない。RLSにより空配列やエラーが返ることも
    // あるが、Supabase側にリクエストが届くこと自体が目的なので、
    // どちらの場合も「キープアライブ成功」として扱う。
    const { error } = await supabase.from("books").select("id").limit(1);

    return NextResponse.json({
      ok: true,
      pinged_at: new Date().toISOString(),
      note: error ? `query returned an error (expected under RLS): ${error.message}` : undefined,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "unknown error",
      },
      { status: 500 }
    );
  }
}
