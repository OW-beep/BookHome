import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "『絵本は「読んで終わり」じゃなかった』読者特典｜ブックホーム",
  description:
    "『絵本は「読んで終わり」じゃなかった』（BookHome）の読者特典ページ。年齢別おすすめ絵本の早見表と、読み聞かせ記録シートを無料でダウンロードできます。",
};

const card = {
  border: "1px solid #DCE6F2",
  borderRadius: 12,
  padding: "20px 22px",
  marginTop: 20,
  background: "#FFFFFF",
} as const;

const button = {
  display: "inline-block",
  marginTop: 12,
  padding: "10px 20px",
  borderRadius: 999,
  background: "#33415C",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 700,
} as const;

export default function EhonGuideBonusPage() {
  return (
    <>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 20px 0",
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          color: "#33415C",
          lineHeight: 1.9,
        }}
      >
        <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 24 }}>
          『絵本は「読んで終わり」じゃなかった』読者特典
        </h1>
        <p>
          Kindle本『絵本は「読んで終わり」じゃなかった』（著者：BookHome）の読者特典ページです。
          印刷して使えるシート2点を、無料でダウンロードできます。
        </p>

        <div style={card}>
          <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, margin: 0 }}>
            特典1：年齢別おすすめ絵本 早見表（PDF）
          </h2>
          <p>
            第2章の年齢別の選び方をもとに、定番絵本をISBNつきで年齢別に並べた一覧です。
            0〜2歳・3〜4歳・5〜6歳、各4冊の計12冊。すべてブックホームの記事で実在を確認した本だけを載せています。
          </p>
          <a href="/bonus/ehon-hayami.pdf" download style={button}>
            早見表をダウンロード（PDF）
          </a>
        </div>

        <div style={card}>
          <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, margin: 0 }}>
            特典2：読み聞かせ記録シート（PDF）
          </h2>
          <p>
            第8章で紹介した「日付・タイトル・子どもの反応」の最小セットを、そのまま書き込める記録シートです。
            印刷して繰り返し使えます。
          </p>
          <a href="/bonus/yomikikase-kiroku.pdf" download style={button}>
            記録シートをダウンロード（PDF）
          </a>
        </div>

        <p style={{ marginTop: 32, fontSize: 14, color: "#6B7A90" }}>
          特典は本書の購入者向けの無料配布です。印刷して、本棚のそばでお使いください。
          本の紹介や読み聞かせの記事は、ブックホームの「読みもの」からどうぞ。
        </p>
        <p style={{ marginTop: 8 }}>
          <a href="/articles" style={{ color: "#7FB8E0" }}>
            読みもの記事一覧へ
          </a>
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
