import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostData, getRelatedPosts } from "@/lib/posts";
import { getCategoryByLabel } from "@/lib/categories";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleByline from "@/components/ArticleByline";
import ConclusionBox from "@/components/ConclusionBox";
import TableOfContents from "@/components/TableOfContents";
import FaqSection from "@/components/FaqSection";
import PostCard from "@/components/PostCard";
import AdUnit from "@/components/AdUnit";
import SiteFooter from "@/components/SiteFooter";


export function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getPostData(params.slug);
    const url = `${SITE_URL}/articles/${params.slug}`;
    return {
      title: `${post.title}｜${SITE_NAME}`,
      description: post.excerpt,
      alternates: { canonical: url },
      ...(post.noindex ? { robots: { index: false, follow: true } } : {}),
      openGraph: { type: "article", title: post.title, description: post.excerpt, url, publishedTime: post.date },
    };
  } catch {
    return { title: "記事が見つかりません" };
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = await getPostData(params.slug);
  } catch {
    return notFound();
  }
  const category = getCategoryByLabel(post.category);
  const related = getRelatedPosts(post.category, post.slug, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/about` },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/articles/${post.slug}`,
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 300px, #F3F8FC 100%)" }}>
      <style>{`
        .ap-wrap { max-width: 680px; margin: 0 auto; padding: 40px 20px 40px; font-family: 'M PLUS Rounded 1c', sans-serif; color: #33415C; }
        .ap-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 26px; line-height: 1.5; margin: 8px 0 10px; }
        .ap-date { font-size: 12px; color: #7A88A3; }
        .ap-cta { background: #FFFBF3; border-radius: 18px; padding: 22px; text-align: center; margin-top: 48px; }
        .ap-cta-btn { display: inline-block; margin-top: 12px; background: #FF8FA0; color: #fff; text-decoration: none; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 14px; padding: 12px 26px; border-radius: 999px; box-shadow: 0 4px 0 #E06B7D; }
        .ap-rel-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 18px; margin: 48px 0 14px; }
        .ap-back { display: inline-block; margin-top: 30px; font-size: 13px; color: #7FB8E0; text-decoration: none; }
      `}</style>
      <div className="ap-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <Breadcrumbs
          items={[
            { label: SITE_NAME, href: "/" },
            { label: "読みもの", href: "/articles" },
            ...(category ? [{ label: category.label, href: `/category/${category.slug}` }] : []),
            { label: post.title },
          ]}
          currentPath={`/articles/${post.slug}`}
        />

        <article>
          <div style={{ fontSize: 12, color: "#7FB8E0" }}>{post.category}</div>
          <h1 className="ap-title">{post.title}</h1>
          <time className="ap-date">
            公開日：{post.date}
            {post.updated && post.updated !== post.date && <span style={{ marginLeft: 12 }}>更新日：{post.updated}</span>}
          </time>

          <ArticleByline />
          <ConclusionBox items={post.tldr} />
          <TableOfContents items={post.toc} />

          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>

        <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE} />

        <FaqSection items={post.faq} />

        <div className="ap-cta">
          <div style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 15 }}>📚 読んだ本、持っている本を記録してみませんか？</div>
          <div style={{ fontSize: 12, color: "#7A88A3", marginTop: 6 }}>バーコードをスキャンするだけの、無料の読書記録アプリです。</div>
          <Link className="ap-cta-btn" href="/login">無料ではじめる</Link>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="ap-rel-title">関連する読みもの</h2>
            {related.map((r) => <PostCard key={r.slug} post={r} />)}
          </section>
        )}

        <Link className="ap-back" href="/articles">← 読みもの一覧に戻る</Link>
      </div>
      <SiteFooter />
    </div>
  );
}
