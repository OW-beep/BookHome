import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import SiteFooter from "@/components/SiteFooter";


export function generateStaticParams() {
  return CATEGORIES.filter((c) => getPostsByCategory(c.label).length > 0).map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const c = getCategoryBySlug(params.category);
  if (!c) return {};
  return {
    title: `${c.label}の読みもの｜${SITE_NAME}`,
    description: c.description,
    alternates: { canonical: `${SITE_URL}/category/${c.slug}` },
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const c = getCategoryBySlug(params.category);
  if (!c) return notFound();
  const posts = getPostsByCategory(c.label).filter((p) => !p.noindex);
  if (posts.length === 0) return notFound();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 300px, #F3F8FC 100%)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 24px", fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#33415C" }}>
        <Breadcrumbs
          items={[{ label: SITE_NAME, href: "/" }, { label: "読みもの", href: "/articles" }, { label: c.label }]}
          currentPath={`/category/${c.slug}`}
        />
        <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: 26, marginBottom: 8 }}>{c.label}</h1>
        <p style={{ fontSize: 13, color: "#7A88A3", marginBottom: 28, lineHeight: 1.8 }}>{c.description}</p>
        {posts.map((p) => <PostCard key={p.slug} post={p} />)}
        <Link href="/articles" style={{ display: "inline-block", marginTop: 30, fontSize: 13, color: "#7FB8E0", textDecoration: "none" }}>← 読みもの一覧に戻る</Link>
      </div>
      <SiteFooter />
    </div>
  );
}
