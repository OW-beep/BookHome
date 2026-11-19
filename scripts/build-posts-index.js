// 記事の一覧データ（トップページで使用）を、content/posts から生成します。
// トップページは、ログイン状態を見るために毎回サーバーで描画されるため、
// 実行時にファイルを読まなくて済むよう、ビルド前にJSONへ書き出しておきます。
// npm run build / npm run dev の前に、自動で実行されます。
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const dir = path.join(process.cwd(), "content/posts");
const posts = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const { data } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    return {
      slug: f.replace(/\.md$/, ""),
      title: data.title,
      category: data.category,
      date: data.date,
      excerpt: data.excerpt,
      noindex: Boolean(data.noindex),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const out = path.join(process.cwd(), "lib/generated/posts-index.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(posts, null, 2) + "\n");
console.log(`posts-index.json: ${posts.length} posts`);
