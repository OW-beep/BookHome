export const GENRES = [
  "えほん",
  "ずかん",
  "しょうせつ",
  "まんが",
  "ざっし",
  "ビジネス",
  "その他",
] as const;

export const COVER_COLORS = [
  "#FF8FA0",
  "#FFC94A",
  "#7EC98C",
  "#7FB8E0",
  "#B9A6E0",
  "#F4A672",
  "#7ED6C4",
  "#F27F7F",
] as const;

export const EMOJIS = [
  "📕", "📗", "📘", "📙", "📓", "📔", "📒", "📚",
  "🦕", "🦖", "🐻", "🐰", "🦉", "🐱", "🐶", "🦁",
  "🐸", "🐢", "🐘", "🦋", "🐟", "🦄", "🐦", "🐼",
  "🚀", "🌙", "⭐", "🌈", "☀️", "🌳", "🌸", "🍎",
  "🍰", "🥐", "🎂", "🎈", "🏠", "❤️", "🚗", "⚽",
] as const;

export type Genre = (typeof GENRES)[number];

export type BookComment = {
  id: string;
  book_id: string;
  text: string;
  created_at: string;
};

export type Book = {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  genre: string;
  cover_color: string;
  cover_emoji: string;
  rating: number;
  favorite: boolean;
  read_count: number;
  publisher: string | null;
  list_price: number | null;
  purchase_price: number | null;
  isbn: string | null;
  cover_image_url: string | null;
  created_at: string;
  book_comments: BookComment[];
};

export type ReadingType = "self_read" | "read_aloud";

export type UserSettings = {
  annual_goal: number | null;
};

export type ReadingLog = {
  id: string;
  book_id: string;
  minutes: number | null;
  reading_type: ReadingType;
  readers: string[] | null;
  completed: boolean;
  read_at: string;
};
