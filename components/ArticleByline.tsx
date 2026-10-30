import Link from "next/link";

export default function ArticleByline() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#7A88A3", borderTop: "1px solid #D9E4EF", borderBottom: "1px solid #D9E4EF", padding: "10px 0", margin: "20px 0 28px" }}>
      <span>執筆・運営：<Link href="/about" style={{ color: "#4E93C4" }}>ブックホーム運営者</Link></span>
      <span style={{ color: "#B0BBCC" }}>|</span>
      <Link href="/editorial-policy" style={{ color: "#4E93C4" }}>編集方針を見る</Link>
    </div>
  );
}
