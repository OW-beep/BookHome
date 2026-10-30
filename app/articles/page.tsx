import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { CATEGORIES } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "読みもの｜ブックホーム",
  description: "本・読書・読み聞かせの「困った」「わからない」にこたえる読みものです。読書記録、本棚の整理、本選び、積読までまとめています。",
  alternates: { canonical: `${SITE_URL}/articles` },
};

export default function ArticlesIndexPage() {
  const posts = getSortedPostsData().filter((p) => !p.noindex);
  const counts = new Map<string, number>();
  posts.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 300px, #F3F8FC 100%)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 20px 24px", fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#33415C" }}>
        <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: 28, marginBottom: 8 }}>📚 読みもの</h1>
        <p style={{ fontSize: 13, color: "#7A88A3", marginBottom: 24, lineHeight: 1.8 }}>
          本・読書・読み聞かせの「困った」「わからない」にこたえる読みものです。
        </p>

        <nav aria-label="カテゴリ" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {CATEGORIES.filter((c) => counts.get(c.label)).map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} style={{ background: "#fff", border: "1px solid #D9E4EF", borderRadius: 999, padding: "6px 14px", fontSize: 13, color: "#33415C", textDecoration: "none" }}>
              {c.label}（{counts.get(c.label)}）
            </Link>
          ))}
        </nav>

        {posts.map((p) => <PostCard key={p.slug} post={p} />)}

        <Link href="/" style={{ display: "inline-block", marginTop: 30, fontSize: 13, color: "#7FB8E0", textDecoration: "none" }}>← トップページに戻る</Link>
      </div>
      <SiteFooter />
    </div>
  );
}
