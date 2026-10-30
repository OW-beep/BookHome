import Link from "next/link";
import { CATEGORIES, CATEGORY_GROUPS } from "@/lib/categories";
import { getSortedPostsData } from "@/lib/posts";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";


export const metadata = {
  title: "サイトマップ｜ブックホーム",
  description: "ブックホームのページ一覧です。",
  alternates: { canonical: `${SITE_URL}/sitemap` },
};

const h2 = { fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 28 } as const;
const a = { color: "#4E93C4" } as const;

export default function SitemapPage() {
  const posts = getSortedPostsData().filter((p) => !p.noindex);
  return (
    <>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 0", fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#33415C", lineHeight: 1.9 }}>
        <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 24 }}>サイトマップ</h1>

        <h2 style={h2}>サービス</h2>
        <ul>
          <li><Link href="/" style={a}>ブックホーム（トップ）</Link></li>
          <li><Link href="/login" style={a}>ログイン・新規登録</Link></li>
        </ul>

        <h2 style={h2}>読みもの</h2>
        <ul>
          <li><Link href="/articles" style={a}>読みもの一覧</Link></li>
        </ul>
        {CATEGORY_GROUPS.map((g) => (
          <div key={g.slug}>
            <h3 style={{ fontSize: 16, margin: "20px 0 4px" }}>{g.label}</h3>
            {CATEGORIES.filter((c) => c.group === g.slug).map((c) => {
              const list = posts.filter((p) => p.category === c.label);
              if (list.length === 0) return null;
              return (
                <div key={c.slug}>
                  <h4 style={{ fontSize: 14, margin: "10px 0 2px" }}><Link href={`/category/${c.slug}`} style={a}>{c.label}</Link></h4>
                  <ul>
                    {list.map((p) => <li key={p.slug}><Link href={`/articles/${p.slug}`} style={a}>{p.title}</Link></li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}

        <h2 style={h2}>サイト情報</h2>
        <ul>
          <li><Link href="/about" style={a}>運営者情報</Link></li>
          <li><Link href="/editorial-policy" style={a}>編集方針</Link></li>
          <li><Link href="/privacy" style={a}>プライバシーポリシー</Link></li>
          <li><Link href="/terms" style={a}>利用規約</Link></li>
          <li><Link href="/contact" style={a}>お問い合わせ</Link></li>
        </ul>
      </div>
      <SiteFooter />
    </>
  );
}
