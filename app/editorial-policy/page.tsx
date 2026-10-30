import SiteFooter from "@/components/SiteFooter";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "編集方針｜ブックホーム",
  description: "ブックホームの読みものの作り方、情報の確認方法、誤りがあった場合の対応についてご案内します。",
  alternates: { canonical: `${SITE_URL}/editorial-policy` },
};

const h2 = { fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 } as const;

export default function EditorialPolicyPage() {
  return (
    <>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 0", fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#33415C", lineHeight: 1.9 }}>
        <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 24 }}>編集方針</h1>

        <h2 style={h2}>読みものの作り方</h2>
        <p>
          ブックホームの読みものは、運営者自身の読書・子育ての経験と、公的機関や図書館、出版・書店関連団体などが公開している情報を照らし合わせながら書いています。
          体験談は体験談として、一般的な情報は出典をたどれる形で、区別して書くようにしています。
        </p>

        <h2 style={h2}>書くときに大切にしていること</h2>
        <ul>
          <li>読者の「困りごと」「わからないこと」から出発し、冒頭で結論をお伝えします。</li>
          <li>専門用語は、その場で意味を補足します。</li>
          <li>他のサイトや書籍の文章をそのまま転載せず、自分の言葉で書きます。</li>
          <li>図書館の制度や各サービスの仕様など、地域や時期で変わる内容は、その旨を本文に明記します。</li>
        </ul>

        <h2 style={h2}>専門的な内容について</h2>
        <p>
          子どもの発達・教育・健康などに関わる内容は、一般的な情報の紹介であり、個別の状況に対する専門家の判断に代わるものではありません。
          気になることがある場合は、かかりつけ医、園・学校、図書館の司書など、身近な専門家にご相談ください。
        </p>

        <h2 style={h2}>誤りを見つけた場合・更新について</h2>
        <p>
          内容に誤りや古い情報を見つけた場合は、<a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#7FB8E0" }}>お問い合わせ</a>からお知らせください。確認のうえ、速やかに修正します。
          大きく内容を直した記事には、更新日を表示します。
        </p>

        <h2 style={h2}>広告・アフィリエイトについて</h2>
        <p>
          当サイトは、Google AdSenseなどの広告や、楽天ブックス・Amazonなどのアフィリエイトリンクを利用することがあります。
          広告やリンクの有無によって、記事の内容や評価を変えることはありません。詳しくは<a href="/privacy" style={{ color: "#7FB8E0" }}>プライバシーポリシー</a>をご覧ください。
        </p>

        <p style={{ marginTop: 40 }}><a href="/" style={{ color: "#7FB8E0" }}>← トップページに戻る</a></p>
      </div>
      <SiteFooter />
    </>
  );
}
