-- Book Home: 読書記録の詳細化のための追加マイグレーション
-- SQL Editorで実行してください（既存データは消えません）

alter table public.reading_logs
  add column if not exists reading_type text not null default 'self_read',
  add column if not exists readers text[],
  add column if not exists completed boolean not null default true;

-- reading_type は 'self_read'（一人読み） か 'read_aloud'（読み聞かせ）のどちらか
