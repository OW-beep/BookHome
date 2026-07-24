-- Book Home: 実バーコード読み取り対応のための追加マイグレーション
-- SQL Editorで実行してください（既存データは消えません）

alter table public.books
  add column if not exists isbn text,
  add column if not exists cover_image_url text;
