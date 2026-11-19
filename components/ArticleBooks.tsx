"use client";

import type { PostBook } from "@/lib/posts";
import {
  buildRakutenBookLink,
  buildRakutenKoboLink,
  buildAmazonBookLink,
} from "@/lib/affiliate";
import { trackEvent } from "@/lib/analytics";

// 記事ページ末尾（アプリ登録CTAの前）に表示する「この記事の本を買える枠」。
// 記事フロントマターの books: に { title, author, isbn, note } を書いた記事だけに表示されます。
// リンクは lib/affiliate.ts の既存ヘルパーで生成し、環境変数にアフィリエイトIDが
// 設定されていれば自動で成果報酬付きリンクになります（未設定時は通常の検索リンク）。
export default function ArticleBooks({
  books,
  heading,
  slug,
}: {
  books: PostBook[];
  heading?: string;
  slug: string;
}) {
  if (!books || books.length === 0) return null;

  return (
    <section className="ab-wrap">
      <style>{`
        .ab-wrap { background: #FFFBF3; border-radius: 18px; padding: 22px; margin-top: 48px; box-shadow: 0 3px 0 rgba(51,65,92,0.06); }
        .ab-head { display: flex; align-items: center; gap: 8px; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 16px; color: #33415C; }
        .ab-pr { background: #F1F1EC; color: #9A9A8F; font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 999px; }
        .ab-sub { font-size: 11px; color: #7A88A3; margin-top: 6px; line-height: 1.6; }
        .ab-item { padding: 16px 0 4px; }
        .ab-item + .ab-item { border-top: 1px dashed #E3ECF3; margin-top: 12px; }
        .ab-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 15px; color: #33415C; }
        .ab-author { font-size: 11px; color: #7A88A3; margin-left: 6px; }
        .ab-note { font-size: 12px; color: #7A88A3; line-height: 1.7; margin-top: 4px; }
        .ab-btns { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .ab-btn { display: inline-block; font-size: 12px; font-weight: 700; text-decoration: none; padding: 8px 14px; border-radius: 999px; border: 2px solid; background: #fff; line-height: 1.2; }
        .ab-btn-rakuten { color: #BF0000; border-color: #BF0000; }
        .ab-btn-amazon { color: #B96A00; border-color: #E47911; }
        .ab-btn-kobo { color: #0F7A8A; border-color: #0F7A8A; }
      `}</style>
      <div className="ab-head">
        📖 {heading ?? "この記事で紹介した本"}
        <span className="ab-pr">PR</span>
      </div>
      <div className="ab-sub">
        気になった本は、そのまま購入できます（楽天ブックス・Amazon・楽天Koboへのリンクです）。
      </div>
      {books.map((b) => (
        <div className="ab-item" key={`${b.title}-${b.isbn ?? ""}`}>
          <span className="ab-title">『{b.title}』</span>
          {b.author && <span className="ab-author">{b.author}</span>}
          {b.note && <div className="ab-note">{b.note}</div>}
          <div className="ab-btns">
            <a
              className="ab-btn ab-btn-rakuten"
              href={buildRakutenBookLink({ isbn: b.isbn, title: b.title })}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              onClick={() =>
                trackEvent("affiliate_click", {
                  channel: "rakuten_books",
                  placement: "article_books",
                  article: slug,
                  title: b.title,
                })
              }
            >
              楽天ブックスで買う
            </a>
            <a
              className="ab-btn ab-btn-amazon"
              href={buildAmazonBookLink({ isbn: b.isbn, title: b.title })}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              onClick={() =>
                trackEvent("affiliate_click", {
                  channel: "amazon",
                  placement: "article_books",
                  article: slug,
                  title: b.title,
                })
              }
            >
              Amazonで買う
            </a>
            <a
              className="ab-btn ab-btn-kobo"
              href={buildRakutenKoboLink({ title: b.title })}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              onClick={() =>
                trackEvent("affiliate_click", {
                  channel: "rakuten_kobo",
                  placement: "article_books",
                  article: slug,
                  title: b.title,
                })
              }
            >
              楽天Kobo（電子書籍）
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}
