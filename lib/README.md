# Book Home（ブックホーム）

家族全員でも、こども専用でも使える本棚アプリのMVPプロトタイプです。
Next.js (App Router) + TypeScript + Tailwind CSS + Supabase（認証・DB）構成。

## 動く機能

- メールのマジックリンクでログイン（パスワード不要）
- **本物のバーコードスキャン**：スマホ・PCのカメラで本の裏表紙のISBNバーコードを読み取り、openBD（国内書誌データベース、無料）→ 見つからなければGoogle Books の順で自動的にタイトル・著者・出版社・表紙画像を取得
- 本の登録（手入力も可能、出版社・定価・購入価格も記録可）
- 本棚表示（棚に背表紙が並ぶデザイン）、ジャンル絞り込み、検索
- ★評価、❤️お気に入り、読んだ回数カウント（読書時間の記録も任意で可能）、コメント（思い出メモ）
- 図書館レベル（読んだ回数に応じて育つ簡易ゲーム化）
- 統計ダッシュボード：蔵書数・購入総額・平均購入価格・今月/今年よんだ回数・合計読書時間・読了率・ジャンル割合・人気作者・人気出版社
- データはSupabaseに保存され、ユーザーごとにRLSで保護されます

## バーコードスキャンについての注意

- カメラはブラウザの標準機能（getUserMedia）を使うため、**HTTPS環境が必須**です（Vercelにデプロイしたサイトなら自動的にHTTPSなので問題ありません。ローカルの `http://localhost` でも動きますが、`http://`の独自サーバー等では動作しません）
- 初回はブラウザがカメラの使用許可を求めます。許可しないと機能しません
- 対応しているのは書籍用のJANバーコード（ISBN、978/979から始まる13桁）のみです。それ以外のバーコード（レシートや他の商品）は無視して自動的にスキャンを継続します
- ISBN検索に失敗した場合（絶版本・同人誌・海外本など）は、その場で手入力に切り替えられます

## 既存プロジェクトに今回の機能を追加する場合

すでに `schema.sql` を実行済みのSupabaseプロジェクトを使っている場合は、追加で以下のSQLをSQL Editorで実行してください（既存データは消えません）。

- 統計機能：`supabase/migrations_002_stats.sql`
- バーコードスキャン（ISBN・表紙URL保存用）：`supabase/migrations_003_isbn.sql`

これから新規にプロジェクトを作る場合は `schema.sql` だけで最新の状態になります。

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
