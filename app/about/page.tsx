import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "運営者情報｜ブックホーム",
  description:
    "ブックホームの運営者情報、サイトの目的、記事の方針についてご紹介します。",
};

const h2 = { fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 } as const;

export default function AboutPage() {
  return (
    <>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 0", fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#33415C", lineHeight: 1.9 }}>
        <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 24 }}>運営者情報</h1>

        <h2 style={h2}>サイトについて</h2>
        <p>
          「ブックホーム」は、バーコードで本を登録して、読書記録・読み聞かせの記録・思い出を残せる無料の本棚アプリです。
          あわせて、本や読書にまつわる「ちょっとした困りごと」「よくわからないこと」に答える読みものを掲載しています。
        </p>

        <h2 style={h2}>運営者</h2>
        <p>
          3人の子どもを育てながら、個人でブックホームを開発・運営しています。
          自分たちの家族の本棚を整理したい、読み聞かせの記録を無理なく続けたい、という実体験からこのサービスを作りました。
        </p>
        {/* TODO: ニックネーム・Xアカウント等を載せると運営者の実在性が伝わり、審査・読者の信頼の両面で有利です */}

        <h2 style={h2}>記事の方針</h2>
        <p>
          読みものは、運営者の実体験と、公的機関・研究などの公開情報をもとに書いています。
          医療・教育などの専門的な判断を代わるものではなく、あくまで一つの参考としてお読みください。
          誤りに気づかれた場合は、お問い合わせからお知らせいただければ、確認のうえ修正します。
        </p>

        <h2 style={h2}>広告・アフィリエイトについて</h2>
        <p>
          当サイトでは、Google AdSenseなどの第三者配信広告や、楽天ブックス・Amazonなどのアフィリエイトリンクを利用することがあります。
          詳しくは<a href="/privacy" style={{ color: "#7FB8E0" }}>プライバシーポリシー</a>をご覧ください。
        </p>

        <h2 style={h2}>お問い合わせ</h2>
        <p>
          <a href="/contact" style={{ color: "#7FB8E0" }}>お問い合わせページ</a>からご連絡ください。
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
