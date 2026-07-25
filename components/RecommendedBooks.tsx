"use client";

import { useEffect, useState } from "react";
import { pickRandomRecommendations } from "@/lib/recommendations";
import { buildRakutenBookLink } from "@/lib/affiliate";

type TrendingBook = {
  title: string;
  author: string | null;
  imageUrl: string | null;
  url: string;
  isbn: string | null;
};

export default function RecommendedBooks() {
  const [trending, setTrending] = useState<TrendingBook[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallbackBooks] = useState(() => pickRandomRecommendations(4));

  useEffect(() => {
    let cancelled = false;
    fetch("/api/trending-books")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.source === "rakuten" && Array.isArray(data.books) && data.books.length > 0) {
          setTrending(data.books);
        } else {
          setTrending(null);
        }
      })
      .catch(() => {
        if (!cancelled) setTrending(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const usingTrending = !loading && trending && trending.length > 0;

  return (
    <div className="rb-wrap">
      <style>{`
        .rb-wrap { max-width: 900px; margin: 8px auto 60px; padding: 0 20px; }
        .rb-header { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #B0BBCC; font-weight: 700; margin-bottom: 8px; }
        .rb-pr-badge { background: #F1F1EC; color: #9A9A8F; font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 999px; }
        .rb-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
        .rb-card { flex-shrink: 0; width: 132px; background: #FFFBF3; border-radius: 14px; padding: 10px; text-decoration: none; color: #33415C; box-shadow: 0 2px 0 rgba(51,65,92,0.05); }
        .rb-emoji { font-size: 22px; }
        .rb-cover { width: 100%; height: 88px; object-fit: contain; border-radius: 6px; background: #EAF4FB; }
        .rb-title { font-size: 11px; font-weight: 700; margin-top: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .rb-author { font-size: 10px; color: #B0BBCC; margin-top: 2px; }
      `}</style>
      <div className="rb-header">
        {usingTrending ? "🔥 絵本・児童書 今売れている本" : "📚 こんな本もおすすめ"}
        <span className="rb-pr-badge">PR</span>
      </div>
      <div className="rb-row">
        {usingTrending
          ? trending!.map((b) => (
              <a
                key={b.title}
                className="rb-card"
                href={b.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                {b.imageUrl ? (
                  <img className="rb-cover" src={b.imageUrl} alt={b.title} />
                ) : (
                  <div className="rb-emoji">📕</div>
                )}
                <div className="rb-title">{b.title}</div>
                <div className="rb-author">{b.author}</div>
              </a>
            ))
          : fallbackBooks.map((b) => (
              <a
                key={b.title}
                className="rb-card"
                href={buildRakutenBookLink({ title: `${b.title} ${b.author}` })}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                <div className="rb-emoji">{b.emoji}</div>
                <div className="rb-title">{b.title}</div>
                <div className="rb-author">{b.author}</div>
              </a>
            ))}
      </div>
    </div>
  );
}
