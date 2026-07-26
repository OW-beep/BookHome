"use client";

import { useMemo, useState } from "react";
import { X, TrendingUp } from "lucide-react";
import { Book, ReadingLog, FamilyMember } from "@/lib/types";
import { computeBadges, buildCalendarData, computeCurrentStreak } from "@/lib/gamification";

function yen(n: number) {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

function calendarColor(count: number) {
  if (count === 0) return "#E3ECF3";
  if (count === 1) return "#B9E3C6";
  if (count <= 3) return "#7EC98C";
  return "#3F9457";
}

export default function StatsModal({
  books,
  readingLogs,
  familyMembers,
  annualGoal,
  onSaveGoal,
  onClose,
}: {
  books: Book[];
  readingLogs: ReadingLog[];
  familyMembers: FamilyMember[];
  annualGoal: number | null;
  onSaveGoal: (goal: number | null) => void;
  onClose: () => void;
}) {
  const [goalInput, setGoalInput] = useState(annualGoal != null ? String(annualGoal) : "");
  const [editingGoal, setEditingGoal] = useState(annualGoal == null);
  const [tab, setTab] = useState<"stats" | "achievements">("stats");

  const badges = useMemo(() => computeBadges(books, readingLogs), [books, readingLogs]);
  const calendarDays = useMemo(() => buildCalendarData(readingLogs), [readingLogs]);
  const streak = useMemo(() => computeCurrentStreak(readingLogs), [readingLogs]);

  const familyRanking = useMemo(() => {
    const counts = new Map<string, number>();
    familyMembers.forEach((m) => counts.set(m.name, 0));
    readingLogs.forEach((l) => {
      (l.readers ?? []).forEach((name) => {
        if (counts.has(name)) {
          counts.set(name, (counts.get(name) ?? 0) + 1);
        }
      });
    });
    return familyMembers
      .map((m) => ({ member: m, count: counts.get(m.name) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [familyMembers, readingLogs]);
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
        .stats-badge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .stats-badge { text-align: center; background: #fff; border-radius: 12px; padding: 10px 6px; opacity: 0.4; }
        .stats-badge.unlocked { opacity: 1; background: #FFFDF3; box-shadow: 0 2px 0 rgba(255,201,74,0.4); }
        .stats-badge-emoji { font-size: 22px; }
        .stats-badge-label { font-size: 10px; font-weight: 700; color: #33415C; margin-top: 4px; line-height: 1.3; }
        .stats-badge-progress { font-size: 9px; color: #B0BBCC; margin-top: 2px; }
        .stats-goal-card { background: #EAF4FB; border-radius: 14px; padding: 14px; }
        .stats-goal-track { height: 14px; background: #E3ECF3; border-radius: 999px; overflow: hidden; margin-top: 8px; }
        .stats-goal-fill { height: 100%; background: linear-gradient(90deg, #7EC98C, #7FB8E0); border-radius: 999px; transition: width 0.4s ease; }
        .stats-goal-label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #33415C; }
        .stats-goal-edit { display: flex; gap: 6px; margin-top: 8px; }
        .stats-goal-edit input { flex: 1; border: 2px solid #E3ECF3; border-radius: 10px; padding: 7px 10px; font-family: inherit; font-size: 13px; outline: none; }
        .stats-goal-edit button { background: #33415C; color: #fff; border: none; border-radius: 10px; padding: 0 14px; font-weight: 700; cursor: pointer; }
        .stats-goal-edit-link { background: none; border: none; color: #7A88A3; font-size: 11px; cursor: pointer; margin-top: 6px; text-decoration: underline; }
        .stats-calendar { display: grid; grid-template-rows: repeat(7, 12px); grid-auto-flow: column; grid-auto-columns: 12px; gap: 3px; overflow-x: auto; padding: 2px; }
        .stats-calendar-cell { width: 12px; height: 12px; border-radius: 3px; }
        .stats-streak-line { font-size: 12px; color: #7A88A3; margin-top: 8px; }
        .stats-tabbar { display: flex; gap: 6px; margin-bottom: 18px; background: #EAF4FB; padding: 4px; border-radius: 14px; }
        .stats-tab { flex: 1; border: none; background: transparent; padding: 9px 8px; border-radius: 10px; font-family: inherit; font-weight: 700; font-size: 13px; color: #7A88A3; cursor: pointer; }
        .stats-tab.active { background: #fff; color: #33415C; box-shadow: 0 2px 0 rgba(51,65,92,0.08); }
      `}</style>
      <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stats-close" onClick={onClose}>
          <X size={16} />
        </button>
        <div className="stats-title">
          <TrendingUp size={18} color="#7EC98C" /> としょかんの統計
        </div>

        <div className="stats-tabbar">
          <button type="button" className={`stats-tab ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")}>
            📊 統計
          </button>
          <button type="button" className={`stats-tab ${tab === "achievements" ? "active" : ""}`} onClick={() => setTab("achievements")}>
            🏆 実績・目標
          </button>
        </div>

        {tab === "achievements" && (
          <>
            <div className="stats-section-title" style={{ marginTop: 0 }}>実績バッジ</div>
            <div className="stats-badge-grid">
              {badges.map((b) => (
                <div className={`stats-badge ${b.unlocked ? "unlocked" : ""}`} key={b.id}>
                  <div className="stats-badge-emoji">{b.emoji}</div>
                  <div className="stats-badge-label">{b.label}</div>
                  <div className="stats-badge-progress">{b.progressText}</div>
                </div>
              ))}
            </div>

            <div className="stats-section-title">年間目標</div>
            <div className="stats-goal-card">
              {editingGoal ? (
                <div className="stats-goal-edit">
                  <input
                    type="number"
                    min="1"
                    placeholder="例：100"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const n = Number(goalInput);
                      if (n > 0) {
                        onSaveGoal(n);
                        setEditingGoal(false);
                      }
                    }}
                  >
                    設定
                  </button>
                </div>
              ) : (
                <>
                  <div className="stats-goal-label">
                    <span>今年 {stats.readThisYear}冊</span>
                    <span>目標 {annualGoal}冊</span>
                  </div>
                  <div className="stats-goal-track">
                    <div
                      className="stats-goal-fill"
                      style={{
                        width: `${Math.min(100, annualGoal ? (stats.readThisYear / annualGoal) * 100 : 0)}%`,
                      }}
                    />
                  </div>
                  <button className="stats-goal-edit-link" onClick={() => setEditingGoal(true)}>
                    目標を変更する
                  </button>
                </>
              )}
            </div>

            <div className="stats-section-title">読書カレンダー（直近12週間）</div>
            <div className="stats-calendar">
              {calendarDays.map((d) => (
                <div
                  key={d.date}
                  className="stats-calendar-cell"
                  style={{ background: calendarColor(d.count) }}
                  title={`${d.date}：${d.count}回`}
                />
              ))}
            </div>
            <div className="stats-streak-line">🔥 現在 {streak}日連続で記録中</div>

            <div className="stats-section-title">家族ランキング</div>
            {familyMembers.length === 0 ? (
              <div className="stats-family-note">
                「👪 家族」ボタンから家族メンバーを登録すると、読んだ回数のランキングがここに表示されます。
              </div>
            ) : (
              <div className="stats-rank-list">
                {familyRanking.map(({ member, count }, i) => (
                  <div className="stats-rank-item" key={member.id}>
                    <span className="stats-rank-name">
                      {i === 0 && count > 0 ? "🥇 " : i === 1 && count > 0 ? "🥈 " : i === 2 && count > 0 ? "🥉 " : ""}
                      {member.emoji} {member.name}
                    </span>
                    <span className="stats-rank-score">{count}回よんだ</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "stats" && (
          <>
            <div className="stats-grid" style={{ marginTop: 0 }}>
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
          </>
        )}
      </div>
    </div>
  );
}
