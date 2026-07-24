// 楽天ブックスへのリンクを組み立てるヘルパー。
//
// NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID が未設定の間は、ただの楽天ブックス検索リンクとして機能します。
// 楽天アフィリエイトの審査が通ったら、環境変数にアフィリエイトIDを設定するだけで
// 自動的に成果報酬付きのリンクに切り替わります（コードの変更は不要です）。
//
// アフィリエイトIDは Supabaseの値と同様、Vercelの Environment Variables から設定してください。
// 例: NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID=1a2b3c4d.5e6f7g8h...

export function buildRakutenBookLink(query: {
  isbn?: string | null;
  title: string;
}): string {
  const keyword = query.isbn || query.title;
  const target = `https://books.rakuten.co.jp/search/?sitem=${encodeURIComponent(
    keyword
  )}`;

  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;
  if (!affiliateId) return target;

  const encoded = encodeURIComponent(target);
  return `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encoded}&m=${encoded}`;
}
