export type RecommendedBook = {
  title: string;
  author: string;
  emoji: string;
};

// 定番の絵本・児童書のキュレーションリスト（静的）。
// 個人の読書データに基づく本格的なレコメンドではなく、
// 「まず何を薦めればいいか分からない」新規ユーザー向けの入り口として使う想定。
export const RECOMMENDED_BOOKS: RecommendedBook[] = [
  { title: "はらぺこあおむし", author: "エリック・カール", emoji: "🐛" },
  { title: "ぐりとぐら", author: "なかがわりえこ", emoji: "🍳" },
  { title: "おおきなかぶ", author: "内田莉莎子 再話", emoji: "🥕" },
  { title: "100万回生きたねこ", author: "佐野洋子", emoji: "🐱" },
  { title: "からすのパンやさん", author: "かこさとし", emoji: "🥐" },
  { title: "そらまめくんのベッド", author: "なかやみわ", emoji: "🫛" },
  { title: "だるまさんが", author: "かがくいひろし", emoji: "🎎" },
  { title: "しろくまちゃんのほっとけーき", author: "わかやまけん", emoji: "🥞" },
];

export function pickRandomRecommendations(count: number): RecommendedBook[] {
  const shuffled = [...RECOMMENDED_BOOKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
