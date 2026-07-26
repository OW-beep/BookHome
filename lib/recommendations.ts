export type RecommendedBook = {
  title: string;
  author: string;
  emoji: string;
  genre: string;
  ageBand: "0-2" | "3-5" | "6-8" | "9-12";
};

// 定番の絵本・児童書のキュレーションリスト（静的）。
// 個人の読書データに基づく本格的なレコメンドではなく、
// 「まず何を薦めればいいか分からない」新規ユーザー向けの入り口として使う想定。
export const RECOMMENDED_BOOKS: RecommendedBook[] = [
  { title: "はらぺこあおむし", author: "エリック・カール", emoji: "🐛", genre: "えほん", ageBand: "0-2" },
  { title: "ぐりとぐら", author: "なかがわりえこ", emoji: "🍳", genre: "えほん", ageBand: "3-5" },
  { title: "おおきなかぶ", author: "内田莉莎子 再話", emoji: "🥕", genre: "えほん", ageBand: "3-5" },
  { title: "100万回生きたねこ", author: "佐野洋子", emoji: "🐱", genre: "えほん", ageBand: "6-8" },
  { title: "からすのパンやさん", author: "かこさとし", emoji: "🥐", genre: "えほん", ageBand: "3-5" },
  { title: "そらまめくんのベッド", author: "なかやみわ", emoji: "🫛", genre: "えほん", ageBand: "0-2" },
  { title: "だるまさんが", author: "かがくいひろし", emoji: "🎎", genre: "えほん", ageBand: "0-2" },
  { title: "しろくまちゃんのほっとけーき", author: "わかやまけん", emoji: "🥞", genre: "えほん", ageBand: "0-2" },
  { title: "ざんねんな生きもの事典", author: "今泉忠明 監修", emoji: "🦥", genre: "ずかん", ageBand: "6-8" },
  { title: "かいけつゾロリ", author: "原ゆたか", emoji: "🦊", genre: "まんが", ageBand: "6-8" },
  { title: "魔女の宅急便", author: "角野栄子", emoji: "🧹", genre: "しょうせつ", ageBand: "9-12" },
  { title: "ぐるんぱのようちえん", author: "西内ミナミ", emoji: "🐘", genre: "えほん", ageBand: "3-5" },
];

export function pickRandomRecommendations(count: number): RecommendedBook[] {
  const shuffled = [...RECOMMENDED_BOOKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function pickByAgeBand(
  ageBand: RecommendedBook["ageBand"],
  count: number
): RecommendedBook[] {
  const matches = RECOMMENDED_BOOKS.filter((b) => b.ageBand === ageBand);
  const shuffled = [...matches].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function pickByGenre(
  genre: string,
  excludeTitle: string,
  count: number
): RecommendedBook[] {
  const matches = RECOMMENDED_BOOKS.filter(
    (b) => b.genre === genre && b.title !== excludeTitle
  );
  const pool = matches.length > 0 ? matches : RECOMMENDED_BOOKS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
