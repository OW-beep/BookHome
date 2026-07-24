import { createClient } from "@/lib/supabase/server";
import { Book, ReadingLog } from "@/lib/types";
import BookShelfClient from "@/components/BookShelfClient";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("books")
    .select("*, book_comments(*)")
    .order("created_at", { ascending: false });

  const { data: readingLogs } = await supabase
    .from("reading_logs")
    .select("id, book_id, minutes, read_at");

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
      userEmail={user?.email ?? ""}
    />
  );
}
