export type Category = {
  slug: string; // /category/[slug]
  label: string; // 記事の frontmatter の category と一致させる
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "yomikikase",
    label: "読み聞かせ",
    description: "いつまで続ける？何歳まで？忙しくても続けるには。読み聞かせの「わからない」を整理します。",
  },
  {
    slug: "kiroku",
    label: "読書記録",
    description: "読んだ本の記録の付け方、続け方、手帳とアプリの違いなど、読書記録にまつわる話題です。",
  },
  {
    slug: "hondana",
    label: "本棚・蔵書管理",
    description: "増えていく本の整理・収納・管理のコツ。二重買いを防ぐ方法も扱います。",
  },
  {
    slug: "erabikata",
    label: "本の選び方・買い方",
    description: "どの本を選ぶか、買うか借りるか、プレゼントに何を選ぶか。本選びの迷いに答えます。",
  },
  {
    slug: "shukan",
    label: "読書習慣・積読",
    description: "本が読めない、積読が減らない。読書習慣のつまずきと、無理のない付き合い方を考えます。",
  },
  {
    slug: "kiso",
    label: "本の基礎知識",
    description: "ISBNの見方など、本にまつわる「ちょっとわからない」を解説します。",
  },
];

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
