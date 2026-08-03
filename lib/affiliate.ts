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

// Amazon.co.jpへのリンクを組み立てるヘルパー。
//
// i=stripbooks で「本」カテゴリに絞り込んだ検索結果に飛ばせます。
// NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG（Amazonアソシエイトのトラッキングid、例: yourtag-22）が
// 未設定の間はただの検索リンクとして機能し、設定すると自動的に成果報酬付きリンクになります。
export function buildAmazonBookLink(query: {
  isbn?: string | null;
  title: string;
}): string {
  const keyword = query.isbn || query.title;
  const associateTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG;

  const params = new URLSearchParams({
    i: "stripbooks",
    k: keyword,
  });
  if (associateTag) params.set("tag", associateTag);

  return `https://www.amazon.co.jp/s?${params.toString()}`;
}
//
// 楽天ブックスの検索に g=101（電子書籍ジャンル）を付けることで、Kobo電子書籍のみに
// 絞り込んだ検索結果に飛ばせます。アフィリエイトIDのラップ方法は紙の本と同じなので、
// NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID が設定されていれば自動的に成果報酬付きリンクになります。
// 電子書籍版はISBNが紙版と異なることが多いため、タイトルのみで検索します（ISBN検索だと
// 電子書籍がヒットしないケースがあるため）。
export function buildRakutenKoboLink(query: { title: string }): string {
  const target = `https://books.rakuten.co.jp/search/?sitem=${encodeURIComponent(
    query.title
  )}&g=101`;

  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;
  if (!affiliateId) return target;

  const encoded = encodeURIComponent(target);
  return `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encoded}&m=${encoded}`;
}
