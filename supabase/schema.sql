-- Book Home: テーブル定義とRLS（Row Level Security）ポリシー
-- SupabaseダッシュボードのSQL Editorに貼り付けて実行してください

-- 本テーブル
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  title text not null,
  author text,
  genre text not null default 'その他',
  cover_color text not null default '#FF8FA0',
  cover_emoji text not null default '📕',
  rating int not null default 0,
  favorite boolean not null default false,
  read_count int not null default 0,
  publisher text,
  list_price numeric,
  purchase_price numeric,
  isbn text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

-- 読んだ記録を1回ごとに残すテーブル（月別/年別集計・読書時間の計算に使用）
create table if not exists public.reading_logs (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references public.books(id) on delete cascade not null,
  user_id uuid references auth.users not null default auth.uid(),
  minutes int,
  reading_type text not null default 'self_read',
  readers text[],
  completed boolean not null default true,
  read_at timestamptz not null default now()
);

alter table public.reading_logs enable row level security;

create policy "reading_logs_select_own" on public.reading_logs
  for select using (auth.uid() = user_id);

create policy "reading_logs_insert_own" on public.reading_logs
  for insert with check (auth.uid() = user_id);

create policy "reading_logs_delete_own" on public.reading_logs
  for delete using (auth.uid() = user_id);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users not null default auth.uid(),
  annual_goal int,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "user_settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);

create policy "user_settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);

create policy "user_settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  emoji text not null default '👤',
  created_at timestamptz not null default now()
);

alter table public.family_members enable row level security;

create policy "family_members_select_own" on public.family_members
  for select using (auth.uid() = user_id);

create policy "family_members_insert_own" on public.family_members
  for insert with check (auth.uid() = user_id);

create policy "family_members_delete_own" on public.family_members
  for delete using (auth.uid() = user_id);

-- コメント（思い出メモ）テーブル
create table if not exists public.book_comments (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references public.books(id) on delete cascade not null,
  user_id uuid references auth.users not null default auth.uid(),
  text text not null,
  created_at timestamptz not null default now()
);

-- RLSを有効化
alter table public.books enable row level security;
alter table public.book_comments enable row level security;

-- books: 自分のデータだけ読み書きできる
create policy "books_select_own" on public.books
  for select using (auth.uid() = user_id);

create policy "books_insert_own" on public.books
  for insert with check (auth.uid() = user_id);

create policy "books_update_own" on public.books
  for update using (auth.uid() = user_id);

create policy "books_delete_own" on public.books
  for delete using (auth.uid() = user_id);

-- book_comments: 自分のコメントだけ読み書きできる
create policy "comments_select_own" on public.book_comments
  for select using (auth.uid() = user_id);

create policy "comments_insert_own" on public.book_comments
  for insert with check (auth.uid() = user_id);

create policy "comments_delete_own" on public.book_comments
  for delete using (auth.uid() = user_id);

-- 参考: 将来「家族で共有」に拡張する場合は、
-- family_id 列を追加し、上記ポリシーを
-- auth.uid() = user_id の代わりに
-- family_id = (select family_id from public.profiles where id = auth.uid())
-- のような条件に差し替える想定です。
