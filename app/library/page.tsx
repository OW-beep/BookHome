import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Book, ReadingLog, UserSettings, FamilyMember } from "@/lib/types";
import BookShelfClient from "@/components/BookShelfClient";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログアウト直後など、未ログイン状態でこのページのレンダリングが
  // 走った場合はここで /login に戻す（middleware は同一リクエスト内の
  // signOut Server Action を検知できないため、ページ側でも保険として必要）。
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("books")
    .select("*, book_comments(*)")
    .order("created_at", { ascending: false });

  const { data: readingLogs } = await supabase
    .from("reading_logs")
    .select("id, book_id, minutes, reading_type, readers, completed, read_at");

  const { data: settings } = await supabase
    .from("user_settings")
    .select("annual_goal")
    .maybeSingle();

  const { data: familyMembers } = await supabase
    .from("family_members")
    .select("id, name, emoji")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <p>データの取得でエラーが発生しました。</p>
        <p style={{ color: "#E06B7D", fontSize: 13 }}>{error.message}</p>
        <p style={{ fontSize: 13, color: "#7A88A3" }}>
          Supabaseで books / book_comments テーブルとRLSポリシーが
          正しく作成されているか確認してください（supabase/schema.sql）。
        </p>
      </div>
    );
  }

  return (
    <BookShelfClient
      initialBooks={(data ?? []) as Book[]}
      initialReadingLogs={(readingLogs ?? []) as ReadingLog[]}
      initialSettings={(settings ?? { annual_goal: null }) as UserSettings}
      initialFamilyMembers={(familyMembers ?? []) as FamilyMember[]}
      userEmail={user?.email ?? ""}
    />
  );
}
