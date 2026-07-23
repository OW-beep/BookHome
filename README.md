# Book Home（ブックホーム）

家族全員でも、こども専用でも使える本棚アプリのMVPプロトタイプです。
Next.js (App Router) + TypeScript + Tailwind CSS + Supabase（認証・DB）構成。

## 動く機能

- メールのマジックリンクでログイン（パスワード不要）
- 本の登録（手入力／バーコードスキャンのデモ）
- 本棚表示（棚に背表紙が並ぶデザイン）、ジャンル絞り込み、検索
- ★評価、❤️お気に入り、読んだ回数カウント、コメント（思い出メモ）
- 図書館レベル（読んだ回数に応じて育つ簡易ゲーム化）
- データはSupabaseに保存され、ユーザーごとにRLSで保護されます

## セットアップ手順

### 1. Supabaseプロジェクトを作る

1. https://supabase.com で無料アカウント作成 → 「New Project」
2. プロジェクトが立ち上がったら、左メニューの **SQL Editor** を開く
3. このリポジトリ内の `supabase/schema.sql` の中身を全部貼り付けて実行（テーブルとRLSポリシーが作成されます）
4. 左メニューの **Authentication → Providers** で `Email` が有効になっていることを確認
5. **Authentication → URL Configuration** の `Site URL` に、Vercelでデプロイした後のURL（例：`https://book-home.vercel.app`）を設定（ローカル確認中は `http://localhost:3000` でOK）
6. **Settings → API** に移動し、`Project URL` と `anon public key` をコピー

### 2. 環境変数を設定

`.env.local.example` を `.env.local` にコピーし、先ほどコピーした値を貼り付けます。

```bash
cp .env.local.example .env.local
```

### 3. ローカルで動作確認

```bash
npm install
npm run dev
```

`http://localhost:3000` を開き、メールアドレスを入力 → 届いたメールのリンクをクリック → ログイン → 本棚が表示されれば成功です。

### 4. GitHubにpush → Vercelでデプロイ

いつものLoopholeと同じ流れです。

1. このフォルダをGitHubリポジトリにpush
2. Vercelで「New Project」→ そのリポジトリを選択
3. **Environment Variables** に `.env.local` と同じ2つの値（`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`）を追加
4. Deploy
5. デプロイ後のURLをSupabaseの `Site URL` / `Redirect URLs` に追加し直す（本番URLでログインを完了させるために必須）

## 既知の制約（MVPゆえの割り切り）

- 家族で1つの本棚を共有する機能はまだ実装していません（今は1ユーザー＝1本棚）。将来 `family_id` を追加してRLSを拡張する想定でスキーマにコメントを残してあります
- バーコードスキャンは実際のカメラ・ISBN APIには接続しておらず、モックデータでの動作確認用です
- 本の表紙画像アップロードは未実装（今は色＋絵文字で表現）

## ディレクトリ構成

```
app/
  login/page.tsx          ログイン画面（マジックリンク送信）
  auth/callback/route.ts  マジックリンクのコールバック処理
  library/page.tsx        本棚ページ（Server Component、データ取得）
  library/actions.ts      本の追加・更新・削除のServer Actions
components/
  BookShelfClient.tsx      本棚のインタラクティブUI（Client Component）
lib/
  supabase/client.ts       ブラウザ用Supabaseクライアント
  supabase/server.ts       サーバー用Supabaseクライアント
  supabase/middleware.ts   セッション更新・認証ガード
  types.ts                 型定義・ジャンル/色/絵文字の定数
supabase/schema.sql        テーブル作成・RLSポリシーのSQL
```
