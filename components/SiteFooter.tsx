import Link from "next/link";

export default function SiteFooter() {
  const linkStyle = { color: "#7A88A3", textDecoration: "none" } as const;
  return (
    <footer
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "24px 20px 48px",
        textAlign: "center",
        fontSize: 12,
        color: "#B0BBCC",
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      <Link href="/" style={linkStyle}>ブックホーム</Link>
      {" ・ "}
      <Link href="/articles" style={linkStyle}>読みもの</Link>
      {" ・ "}
      <Link href="/about" style={linkStyle}>運営者情報</Link>
      {" ・ "}
      <Link href="/privacy" style={linkStyle}>プライバシーポリシー</Link>
      {" ・ "}
      <Link href="/terms" style={linkStyle}>利用規約</Link>
      {" ・ "}
      <Link href="/contact" style={linkStyle}>お問い合わせ</Link>
    </footer>
  );
}
