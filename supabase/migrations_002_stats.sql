-- Book Home: 統計機能拡張のための追加マイグレーション
-- すでに schema.sql を実行済みのSupabaseプロジェクトのSQL Editorで
-- このファイルの中身を実行してください（既存データは消えません）

-- books テーブルに統計計算用の列を追加
alter table public.books
  add column if not exists publisher text,
  add column if not exists list_price numeric,
  add column if not exists purchase_price numeric;

-- 読んだ記録を1回ごとに残すテーブル（月別/年別集計・読書時間の計算に使用）
create table if not exists public.reading_logs (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references public.books(id) on delete cascade not null,
  user_id uuid references auth.users not null default auth.uid(),
  minutes int,
  read_at timestamptz not null default now()
);

alter table public.reading_logs enable row level security;

create policy "reading_logs_select_own" on public.reading_logs
  for select using (auth.uid() = user_id);

create policy "reading_logs_insert_own" on public.reading_logs
  for insert with check (auth.uid() = user_id);

create policy "reading_logs_delete_own" on public.reading_logs
  for delete using (auth.uid() = user_id);
