import Link from "next/link";

export default function AuthorBox() {
  return (
    <aside
      aria-label="この記事を書いた人"
      style={{ background: "#fff", border: "1px solid #D9E4EF", borderRadius: 16, padding: "16px 20px", margin: "40px 0 0", fontSize: 13, lineHeight: 1.9, color: "#4A5873" }}
    >
      <p style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 14, color: "#33415C", margin: "0 0 4px" }}>
        この記事を書いた人
      </p>
      <p style={{ margin: 0 }}>
        3人の子どもを育てながら、読書記録アプリ「ブックホーム」を個人で開発・運営しています。自分たちの家族の本棚を整理したい、読み聞かせの記録を無理なく続けたい、という実体験から、このサイトを作りました。
      </p>
      <p style={{ margin: "6px 0 0" }}>
        <Link href="/about" style={{ color: "#4E93C4" }}>運営者情報</Link>
        {" ・ "}
        <Link href="/editorial-policy" style={{ color: "#4E93C4" }}>編集方針</Link>
      </p>
    </aside>
  );
}
