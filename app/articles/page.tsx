import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export const metadata = {
  title: "読みもの｜ブックホーム",
  description: "絵本・読み聞かせ・読書記録にまつわるコラムです。",
};

export default function ArticlesIndexPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 300px, #F3F8FC 100%)" }}>
      <style>{`
        .ai-wrap { max-width: 720px; margin: 0 auto; padding: 56px 20px; font-family: 'M PLUS Rounded 1c', sans-serif; color: #33415C; }
        .ai-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 28px; margin-bottom: 8px; }
        .ai-sub { font-size: 13px; color: #7A88A3; margin-bottom: 36px; }
        .ai-card { display: block; background: #FFFBF3; border-radius: 18px; padding: 22px; margin-bottom: 14px; text-decoration: none; color: inherit; box-shadow: 0 3px 0 rgba(51,65,92,0.06); }
        .ai-card-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 17px; margin-bottom: 8px; }
        .ai-card-excerpt { font-size: 13px; color: #7A88A3; line-height: 1.7; }
        .ai-card-date { font-size: 11px; color: #B0BBCC; margin-top: 10px; }
        .ai-back { display: inline-block; margin-top: 30px; font-size: 13px; color: #7FB8E0; text-decoration: none; }
      `}</style>
      <div className="ai-wrap">
        <h1 className="ai-title">📚 読みもの</h1>
        <p className="ai-sub">絵本・読み聞かせ・読書記録にまつわるコラムです。</p>

        {ARTICLES.map((a) => (
          <Link className="ai-card" href={`/articles/${a.slug}`} key={a.slug}>
            <div className="ai-card-title">{a.title}</div>
            <div className="ai-card-excerpt">{a.excerpt}</div>
            <div className="ai-card-date">{a.publishedAt}</div>
          </Link>
        ))}

        <Link className="ai-back" href="/">← トップページに戻る</Link>
      </div>
    </div>
  );
}
