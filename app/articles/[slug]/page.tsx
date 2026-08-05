import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title}｜ブックホーム`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return notFound();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 300px, #F3F8FC 100%)" }}>
      <style>{`
        .ap-wrap { max-width: 680px; margin: 0 auto; padding: 56px 20px 80px; font-family: 'M PLUS Rounded 1c', sans-serif; color: #33415C; }
        .ap-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 26px; line-height: 1.5; margin-bottom: 10px; }
        .ap-date { font-size: 12px; color: #B0BBCC; margin-bottom: 32px; }
        .ap-heading { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 18px; margin: 32px 0 12px; }
        .ap-text { font-size: 15px; line-height: 2; margin-bottom: 4px; }
        .ap-cta { background: #FFFBF3; border-radius: 18px; padding: 22px; text-align: center; margin-top: 48px; }
        .ap-cta-btn { display: inline-block; margin-top: 12px; background: #FF8FA0; color: #fff; text-decoration: none; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 14px; padding: 12px 26px; border-radius: 999px; box-shadow: 0 4px 0 #E06B7D; }
        .ap-back { display: inline-block; margin-top: 30px; font-size: 13px; color: #7FB8E0; text-decoration: none; }
      `}</style>
      <div className="ap-wrap">
        <h1 className="ap-title">{article.title}</h1>
        <div className="ap-date">{article.publishedAt}</div>

        {article.body.map((block, i) => (
          <div key={i}>
            {block.heading && <h2 className="ap-heading">{block.heading}</h2>}
            <p className="ap-text">{block.text}</p>
          </div>
        ))}

        <div className="ap-cta">
          <div style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 15 }}>
            📚 読んだ本、記録してみませんか？
          </div>
          <div style={{ fontSize: 12, color: "#7A88A3", marginTop: 6 }}>
            バーコードをスキャンするだけの、無料の読書記録アプリです。
          </div>
          <Link className="ap-cta-btn" href="/login">無料ではじめる</Link>
        </div>

        <Link className="ap-back" href="/articles">← 読みもの一覧に戻る</Link>
      </div>
    </div>
  );
}
