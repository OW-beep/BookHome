"use client";

import { useMemo } from "react";
import { X, TrendingUp } from "lucide-react";
import { Book, ReadingLog } from "@/lib/types";

function yen(n: number) {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export default function StatsModal({
  books,
  readingLogs,
  onClose,
}: {
  books: Book[];
  readingLogs: ReadingLog[];
  onClose: () => void;
}) {
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const totalBooks = books.length;

    const pricedBooks = books.filter(
      (b) => b.list_price !== null && b.list_price !== undefined
    );
    const totalListPrice = pricedBooks.reduce(
      (s, b) => s + (b.list_price ?? 0),
      0
    );
    const avgListPrice =
      pricedBooks.length > 0 ? totalListPrice / pricedBooks.length : 0;

    const readThisMonth = readingLogs.filter((l) => {
      const d = new Date(l.read_at);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const readThisYear = readingLogs.filter((l) => {
      const d = new Date(l.read_at);
      return d.getFullYear() === thisYear;
    }).length;

    const totalMinutes = readingLogs.reduce(
      (s, l) => s + (l.minutes ?? 0),
      0
    );

    const completedBookIds = new Set(
      readingLogs.filter((l) => l.completed).map((l) => l.book_id)
    );
    const readBooks = books.filter((b) => completedBookIds.has(b.id)).length;
    const completionRate =
      totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0;

    const genreCounts = new Map<string, number>();
    books.forEach((b) => {
      genreCounts.set(b.genre, (genreCounts.get(b.genre) ?? 0) + 1);
    });
    const genreBreakdown = Array.from(genreCounts.entries())
      .map(([genre, count]) => ({
        genre,
        count,
        pct: totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const authorScores = new Map<string, number>();
    books.forEach((b) => {
      if (!b.author) return;
      authorScores.set(
        b.author,
        (authorScores.get(b.author) ?? 0) + b.read_count
      );
    });
    const topAuthors = Array.from(authorScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const publisherScores = new Map<string, number>();
    books.forEach((b) => {
      if (!b.publisher) return;
      publisherScores.set(
        b.publisher,
        (publisherScores.get(b.publisher) ?? 0) + b.read_count
      );
    });
    const topPublishers = Array.from(publisherScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      totalBooks,
      totalListPrice,
      avgListPrice,
      readThisMonth,
      readThisYear,
      totalMinutes,
      completionRate,
      genreBreakdown,
      topAuthors,
      topPublishers,
    };
  }, [books, readingLogs]);

  const hours = Math.floor(stats.totalMinutes / 60);
  const mins = stats.totalMinutes % 60;

  return (
    <div className="stats-backdrop" onClick={onClose}>
      <style>{`
        .stats-backdrop { position: fixed; inset: 0; background: rgba(51,65,92,0.35); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 60; }
        .stats-modal { background: #FFFBF3; border-radius: 24px; max-width: 480px; width: 100%; max-height: 88vh; overflow-y: auto; padding: 24px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .stats-close { position: absolute; top: 16px; right: 16px; background: #EAF4FB; border: none; border-radius: 999px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #33415C; }
        .stats-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 19px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; color: #33415C; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
        .stats-card { background: #EAF4FB; border-radius: 14px; padding: 12px 14px; }
        .stats-label { font-size: 11px; color: #7A88A3; font-weight: 700; margin-bottom: 4px; }
        .stats-value { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 18px; color: #33415C; }
        .stats-section-title { font-size: 12px; font-weight: 700; color: #7A88A3; margin: 18px 0 8px; }
        .stats-genre-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 12px; }
        .stats-genre-name { width: 76px; flex-shrink: 0; color: #33415C; font-weight: 700; }
        .stats-genre-track { flex: 1; height: 8px; background: #E3ECF3; border-radius: 999px; overflow: hidden; }
        .stats-genre-fill { height: 100%; background: linear-gradient(90deg, #7FB8E0, #B9A6E0); border-radius: 999px; }
        .stats-genre-pct { width: 34px; text-align: right; color: #7A88A3; }
        .stats-rank-list { display: flex; flex-direction: column; gap: 6px; }
        .stats-rank-item { display: flex; justify-content: space-between; background: #fff; border-radius: 10px; padding: 8px 12px; font-size: 13px; }
        .stats-rank-name { color: #33415C; font-weight: 700; }
        .stats-rank-score { color: #7A88A3; font-size: 11px; }
        .stats-empty { font-size: 12px; color: #B0BBCC; }
        .stats-family-note { background: #FFF4E5; border-radius: 12px; padding: 10px 14px; font-size: 12px; color: #9A7B3F; margin-top: 6px; }
      `}</style>
      <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stats-close" onClick={onClose}>
          <X size={16} />
        </button>
        <div className="stats-title">
          <TrendingUp size={18} color="#7EC98C" /> としょかんの統計
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-label">蔵書数</div>
            <div className="stats-value">{stats.totalBooks} さつ</div>
          </div>
          <div className="stats-card">
            <div className="stats-label">読了率</div>
            <div className="stats-value">{stats.completionRate}%</div>
          </div>
          <div className="stats-card">
            <div className="stats-label">定価の合計</div>
            <div className="stats-value">{yen(stats.totalListPrice)}</div>
          </div>
          <div className="stats-card">
            <div className="stats-label">平均定価</div>
            <div className="stats-value">{yen(stats.avgListPrice)}</div>
          </div>
          <div className="stats-card">
            <div className="stats-label">今月よんだ回数</div>
            <div className="stats-value">{stats.readThisMonth} 回</div>
          </div>
          <div className="stats-card">
            <div className="stats-label">今年よんだ回数</div>
            <div className="stats-value">{stats.readThisYear} 回</div>
          </div>
          <div className="stats-card" style={{ gridColumn: "span 2" }}>
            <div className="stats-label">合計読書時間（記録した回のみ）</div>
            <div className="stats-value">
              {hours > 0 ? `${hours}時間` : ""}
              {mins}分
            </div>
          </div>
        </div>

        <div className="stats-section-title">ジャンル割合</div>
        {stats.genreBreakdown.length === 0 ? (
          <div className="stats-empty">まだ本がありません</div>
        ) : (
          stats.genreBreakdown.map((g) => (
            <div className="stats-genre-row" key={g.genre}>
              <div className="stats-genre-name">{g.genre}</div>
              <div className="stats-genre-track">
                <div
                  className="stats-genre-fill"
                  style={{ width: `${g.pct}%` }}
                />
              </div>
              <div className="stats-genre-pct">{g.pct}%</div>
            </div>
          ))
        )}

        <div className="stats-section-title">人気作者（よく読まれている順）</div>
        {stats.topAuthors.length === 0 ? (
          <div className="stats-empty">データがまだありません</div>
        ) : (
          <div className="stats-rank-list">
            {stats.topAuthors.map(([author, score]) => (
              <div className="stats-rank-item" key={author}>
                <span className="stats-rank-name">{author}</span>
                <span className="stats-rank-score">{score}回よまれた</span>
              </div>
            ))}
          </div>
        )}

        <div className="stats-section-title">人気出版社</div>
        {stats.topPublishers.length === 0 ? (
          <div className="stats-empty">
            出版社が登録された本がまだありません
          </div>
        ) : (
          <div className="stats-rank-list">
            {stats.topPublishers.map(([publisher, score]) => (
              <div className="stats-rank-item" key={publisher}>
                <span className="stats-rank-name">{publisher}</span>
                <span className="stats-rank-score">{score}回よまれた</span>
              </div>
            ))}
          </div>
        )}

        <div className="stats-section-title">家族ランキング</div>
        <div className="stats-family-note">
          この機能は家族アカウント（複数人での共有）を実装した後に追加予定です。
        </div>
      </div>
    </div>
  );
}
