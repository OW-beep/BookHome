import { Book, ReadingLog } from "@/lib/types";

export function getLevelInfo(totalReads: number) {
  const xp = totalReads * 10;
  const xpPerLevel = 50; // 5回読むごとに1レベル
  const level = Math.floor(xp / xpPerLevel) + 1;
  const xpIntoLevel = xp % xpPerLevel;
  const progress = xpIntoLevel / xpPerLevel;
  const title = levelTitle(level);
  return { level, xp, progress, title, xpIntoLevel, xpPerLevel };
}

function levelTitle(level: number): string {
  if (level >= 50) return "本の賢者";
  if (level >= 20) return "読書マスター";
  if (level >= 5) return "図書館の住人";
  if (level >= 2) return "読書ビギナー";
  return "本好きのたまご";
}

export type Badge = {
  id: string;
  emoji: string;
  label: string;
  unlocked: boolean;
  progressText: string;
};

function dateKey(iso: string) {
  return iso.slice(0, 10);
}

export function computeCurrentStreak(readingLogs: ReadingLog[]): number {
  const uniqueDates = new Set(readingLogs.map((l) => dateKey(l.read_at)));
  if (uniqueDates.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // 今日の記録がまだなくても、昨日まで連続していればストリークは継続中とみなす
  if (!uniqueDates.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (uniqueDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeBadges(
  books: Book[],
  readingLogs: ReadingLog[]
): Badge[] {
  const completedBookIds = new Set(
    readingLogs.filter((l) => l.completed).map((l) => l.book_id)
  );
  const completedCount = completedBookIds.size;
  const readAloudCount = readingLogs.filter(
    (l) => l.reading_type === "read_aloud"
  ).length;
  const streak = computeCurrentStreak(readingLogs);
  const totalBooks = books.length;

  const badges: Badge[] = [
    {
      id: "read10",
      emoji: "📗",
      label: "10冊読破",
      unlocked: completedCount >= 10,
      progressText: `${Math.min(completedCount, 10)}/10冊`,
    },
    {
      id: "read50",
      emoji: "📘",
      label: "50冊読破",
      unlocked: completedCount >= 50,
      progressText: `${Math.min(completedCount, 50)}/50冊`,
    },
    {
      id: "read100",
      emoji: "📕",
      label: "100冊読破",
      unlocked: completedCount >= 100,
      progressText: `${Math.min(completedCount, 100)}/100冊`,
    },
    {
      id: "streak7",
      emoji: "🌙",
      label: "7日連続読書",
      unlocked: streak >= 7,
      progressText: `現在${streak}日連続`,
    },
    {
      id: "streak30",
      emoji: "🔥",
      label: "30日連続読書",
      unlocked: streak >= 30,
      progressText: `現在${streak}日連続`,
    },
    {
      id: "readaloud100",
      emoji: "👶",
      label: "100回読み聞かせ",
      unlocked: readAloudCount >= 100,
      progressText: `${Math.min(readAloudCount, 100)}/100回`,
    },
    {
      id: "collection100",
      emoji: "🏆",
      label: "蔵書100冊達成",
      unlocked: totalBooks >= 100,
      progressText: `${Math.min(totalBooks, 100)}/100冊`,
    },
  ];

  return badges;
}

export type CalendarDay = {
  date: string;
  count: number;
};

// 直近84日分（12週間）のカレンダーヒートマップ用データを作る
export function buildCalendarData(readingLogs: ReadingLog[]): CalendarDay[] {
  const counts = new Map<string, number>();
  readingLogs.forEach((l) => {
    const key = dateKey(l.read_at);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return days;
}
