"use client";

import { useEffect, useState } from "react";
import { RECOMMENDED_BOOKS } from "@/lib/recommendations";
import { buildRakutenBookLink } from "@/lib/affiliate";
import { trackEvent } from "@/lib/analytics";

type TrendingBook = {
  title: string;
  author: string | null;
  imageUrl: string | null;
  url: string;
  isbn: string | null;
};

type CardBook = {
  title: string;
  author: string | null;
  emoji?: string;
  imageUrl: string | null;
  url: string;
};

// トップページ（未ログインでも見える場所）に出す「おすすめの本」セクション。
// アプリ内のおすすめと同じく、楽天ブックスのランキングAPI（/api/trending-books）が
// 使える環境では売れ筋＋表紙画像を表示し、APIキー未設定・取得失敗時は
// lib/recommendations.ts の定番リストにフォールバックします（表示は崩れません）。
// リンク先はアフィリエイトID設定時、自動で成果報酬付きになります。
const FALLBACK_BOOKS: CardBook[] = RECOMMENDED_BOOKS.slice(0, 8).map((b) => ({
  title: b.title,
  author: b.author,
  emoji: b.emoji,
  imageUrl: null,
  url: buildRakutenBookLink({ title: `${b.title} ${b.author}` }),
}));

export default function PublicRecommendedBooks() {
  const [books, setBooks] = useState<CardBook[]>(FALLBACK_BOOKS);
  const [usingTrending, setUsingTrending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/trending-books")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (
          data.source === "rakuten" &&
          Array.isArray(data.books) &&
          data.books.length > 0
        ) {
          setBooks(
            (data.books as TrendingBook[]).map((b) => ({
              title: b.title,
              author: b.author,
              imageUrl: b.imageUrl,
              url: b.url,
            }))
          );
          setUsingTrending(true);
        }
      })
      .catch(() => {
        // 取得できない場合は定番リストのまま（フォールバック表示）
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="lp-rec">
      <style>{`
        .lp-rec { max-width: 900px; margin: 72px auto 0; padding: 0 20px; }
        .lp-rec-head { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; }
        .lp-rec-pr { background: #F1F1EC; color: #9A9A8F; font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 999px; }
        .lp-rec-sub { text-align: center; font-size: 12px; color: #7A88A3; margin: 0 0 22px; line-height: 1.7; }
        .lp-rec-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; }
        .lp-rec-card { flex-shrink: 0; width: 140px; background: #FFFBF3; border-radius: 14px; padding: 12px; text-decoration: none; color: #33415C; box-shadow: 0 2px 0 rgba(51,65,92,0.05); }
        .lp-rec-cover { width: 100%; height: 96px; object-fit: contain; border-radius: 6px; background: #EAF4FB; }
        .lp-rec-emoji { font-size: 30px; text-align: center; padding: 18px 0 8px; }
        .lp-rec-title { font-size: 12px; font-weight: 700; margin-top: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .lp-rec-author { font-size: 10px; color: #B0BBCC; margin-top: 2px; }
        .lp-rec-buy { display: inline-block; margin-top: 8px; font-size: 10px; font-weight: 700; color: #BF0000; border: 1.5px solid #BF0000; border-radius: 999px; padding: 3px 10px; background: #fff; }
      `}</style>
      <div className="lp-rec-head">
        <h2 className="lp-section-title" style={{ margin: 0 }}>
          {usingTrending ? "今売れている絵本・児童書" : "おすすめの本"}
        </h2>
        <span className="lp-rec-pr">PR</span>
      </div>
      <p className="lp-rec-sub">
        まずはこの1冊から。気になった本は、楽天ブックスでそのまま購入できます。
        <br />
        買った本は、ブックホームに登録して家族の本棚に残せます。
      </p>
      <div className="lp-rec-row">
        {books.map((b) => (
          <a
            key={b.title}
            className="lp-rec-card"
            href={b.url}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            onClick={() =>
              trackEvent("affiliate_click", {
                channel: "rakuten_books",
                placement: "lp_recommendations",
                title: b.title,
              })
            }
          >
            {b.imageUrl ? (
              <img className="lp-rec-cover" src={b.imageUrl} alt={b.title} />
            ) : (
              <div className="lp-rec-emoji">{b.emoji ?? "📕"}</div>
            )}
            <div className="lp-rec-title">{b.title}</div>
            {b.author && <div className="lp-rec-author">{b.author}</div>}
            <span className="lp-rec-buy">楽天ブックスで見る</span>
          </a>
        ))}
      </div>
    </section>
  );
}
