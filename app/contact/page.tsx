import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "お問い合わせ｜ブックホーム",
  description: "ブックホームへのお問い合わせ先です。",
};

export default function ContactPage() {
  return (
    <>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 0", fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#33415C", lineHeight: 1.9 }}>
        <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 24 }}>お問い合わせ</h1>
        <p>
          サービスの使い方、不具合のご報告、記事内容へのご指摘、アカウント・データの削除のご依頼などは、下記のメールアドレスまでお送りください。
        </p>
        <p style={{ fontSize: 16 }}>
          <a href="mailto:bookhome26.info@gmail.com" style={{ color: "#7FB8E0" }}>bookhome26.info@gmail.com</a>
        </p>
        <p style={{ fontSize: 13, color: "#7A88A3" }}>
          通常、3〜5営業日以内に返信いたします。内容によってはお返事までお時間をいただく場合や、お返事できない場合があります。
        </p>
        <p style={{ marginTop: 40 }}><a href="/" style={{ color: "#7FB8E0" }}>← トップページに戻る</a></p>
      </div>
      <SiteFooter />
    </>
  );
}
