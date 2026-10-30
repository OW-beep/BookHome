export type CategoryGroup = {
  slug: string;
  label: string;
  description: string;
};

// サイトの2本柱。トップ・一覧・サイトマップで、この単位にまとめて見せる
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: "kodomo",
    label: "子どもと本",
    description: "読み聞かせ、絵本選び、図書館との付き合い方。子どもと本の時間を、気楽に楽しむためのお話です。",
  },
  {
    slug: "kurashi",
    label: "本と暮らす",
    description: "読書記録、本棚の整理、積読、本の基礎知識。大人も子どもも、本と気持ちよく暮らすためのヒントです。",
  },
];

export type Category = {
  slug: string; // /category/[slug]
  label: string; // 記事の frontmatter の category と一致させる
  group: "kodomo" | "kurashi";
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "yomikikase",
    label: "読み聞かせ",
    group: "kodomo",
    description: "いつまで続ける？何歳まで？忙しくても続けるには。読み聞かせの「わからない」や、ちょっとした失敗談をまとめます。",
  },
  {
    slug: "erabikata",
    label: "絵本・本の選び方",
    group: "kodomo",
    description: "年齢に合う絵本、プレゼントの選び方、買うか借りるか。絵本・本選びの迷いにこたえます。",
  },
  {
    slug: "toshokan",
    label: "図書館の使い方",
    group: "kodomo",
    description: "借りる、返す、気に入ったら買う。子連れでも使いやすい、図書館との付き合い方です。",
  },
  {
    slug: "kiroku",
    label: "読書記録",
    group: "kurashi",
    description: "読んだ本の記録の付け方、続け方、手帳とアプリの違いなど、読書記録にまつわる話題です。",
  },
  {
    slug: "hondana",
    label: "本棚・蔵書管理",
    group: "kurashi",
    description: "増えていく本の整理・収納・管理のコツ。二重買いを防ぐ方法も扱います。",
  },
  {
    slug: "shukan",
    label: "読書習慣・積読",
    group: "kurashi",
    description: "本が読めない、積読が減らない。読書習慣のつまずきと、無理のない付き合い方を考えます。",
  },
  {
    slug: "kiso",
    label: "本の基礎知識",
    group: "kurashi",
    description: "ISBNの見方など、本にまつわる「ちょっとわからない」を解説します。",
  },
];

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
