-- Book Home: 家族メンバー登録機能（フル認証なしの簡易版）
-- SQL Editorで実行してください（既存データは消えません）

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
