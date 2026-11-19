import Link from "next/link";

export default function SiteHeader() {
  const link = { color: "#33415C", textDecoration: "none", fontSize: 13 } as const;
  return (
    <header
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "14px 20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      <Link href="/" style={{ ...link, fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: 16 }}>
        📚 ブックホーム
      </Link>
      <nav aria-label="メインメニュー" style={{ display: "flex", gap: 16 }}>
        <Link href="/articles" style={link}>読みもの</Link>
        <Link href="/about" style={link}>運営者情報</Link>
      </nav>
    </header>
  );
}
