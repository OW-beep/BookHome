import Link from "next/link";

export default function SiteFooter() {
  const s = { color: "#7A88A3", textDecoration: "none" } as const;
  const links: [string, string][] = [
    ["/", "ブックホーム"],
    ["/articles", "読みもの"],
    ["/sitemap", "サイトマップ"],
    ["/about", "運営者情報"],
    ["/editorial-policy", "編集方針"],
    ["/privacy", "プライバシーポリシー"],
    ["/terms", "利用規約"],
    ["/contact", "お問い合わせ"],
  ];
  return (
    <footer style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px 48px", textAlign: "center", fontSize: 12, color: "#B0BBCC", fontFamily: "'M PLUS Rounded 1c', sans-serif", lineHeight: 2 }}>
      {links.map(([href, label], i) => (
        <span key={href}>
          {i > 0 && " ・ "}
          <Link href={href} style={s}>{label}</Link>
        </span>
      ))}
      <div style={{ marginTop: 8 }}>© 2026 ブックホーム</div>
    </footer>
  );
}
