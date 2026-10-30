import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// 記事は content/posts/<slug>.md を1ファイル追加するだけで公開されます（ファイル名がURLになります）。
const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  category: string;
  date: string;
  updated?: string;
  excerpt: string;
  noindex: boolean;
};

export type TocItem = { id: string; text: string };
export type FaqItem = { q: string; a: string };

function slugifyHeading(text: string, usedIds: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^\w\u3040-\u30ff\u3400-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  let id = base;
  let i = 2;
  while (usedIds.has(id)) {
    id = `${base}-${i}`;
    i += 1;
  }
  usedIds.add(id);
  return id;
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) =>
      /^https?:\/\//.test(href)
        ? `<a href="${href}" rel="noopener noreferrer" target="_blank">${label}</a>`
        : `<a href="${href}">${label}</a>`
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function parseTableRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|")) t = t.slice(0, -1);
  return t.split("|").map((c) => c.trim());
}

const TABLE_SEPARATOR = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

// remark（remark-gfm 未使用）は表を変換しないため、表をプレースホルダーに置き換えてから、後でHTMLの表に戻す
function extractMarkdownTables(markdown: string) {
  const lines = markdown.split("\n");
  const output: string[] = [];
  const tables = new Map<string, string>();
  let idx = 0;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const next = lines[i + 1];
    if (line.includes("|") && next !== undefined && TABLE_SEPARATOR.test(next)) {
      const head = parseTableRow(line);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].includes("|") && lines[j].trim() !== "") {
        rows.push(parseTableRow(lines[j]));
        j++;
      }
      let t = "<table>\n<thead>\n<tr>\n";
      head.forEach((c) => (t += `<th>${inlineMarkdown(c)}</th>\n`));
      t += "</tr>\n</thead>\n<tbody>\n";
      rows.forEach((r) => {
        t += "<tr>\n";
        r.forEach((c) => (t += `<td>${inlineMarkdown(c)}</td>\n`));
        t += "</tr>\n";
      });
      t += "</tbody>\n</table>";
      const ph = `TABLEPLACEHOLDER${idx++}`;
      tables.set(ph, `<div class="post-table-wrap">${t}</div>`);
      output.push("", ph, "");
      i = j;
    } else {
      output.push(line);
      i++;
    }
  }
  return { markdown: output.join("\n"), tables };
}

function restoreMarkdownTables(htmlText: string, tables: Map<string, string>) {
  let result = htmlText;
  tables.forEach((tableHtml, ph) => {
    result = result.replace(`<p>${ph}</p>`, tableHtml).replace(ph, tableHtml);
  });
  return result;
}

function injectHeadingIdsAndBuildToc(htmlText: string) {
  const used = new Set<string>();
  const toc: TocItem[] = [];
  const out = htmlText.replace(/<h2>(.*?)<\/h2>/g, (_m, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "");
    const id = slugifyHeading(text, used);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

function readAll(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const raw = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
      const { data } = matter(raw);
      return {
        slug: fileName.replace(/\.md$/, ""),
        title: data.title as string,
        category: data.category as string,
        date: data.date as string,
        updated: data.updated as string | undefined,
        excerpt: data.excerpt as string,
        noindex: Boolean(data.noindex),
      };
    });
}

export function getSortedPostsData(): PostMeta[] {
  return readAll().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(label: string): PostMeta[] {
  return getSortedPostsData().filter((p) => p.category === label);
}

export function getAllPostSlugs() {
  return readAll().map((p) => ({ slug: p.slug }));
}

// 関連記事：同じカテゴリを優先し、足りなければ新着で補う
export function getRelatedPosts(category: string, excludeSlug: string, limit = 3): PostMeta[] {
  const all = getSortedPostsData().filter((p) => p.slug !== excludeSlug && !p.noindex);
  const same = all.filter((p) => p.category === category);
  const rest = all.filter((p) => p.category !== category);
  return [...same, ...rest].slice(0, limit);
}

export async function getPostData(slug: string) {
  const raw = fs.readFileSync(path.join(postsDirectory, `${slug}.md`), "utf8");
  const m = matter(raw);
  const { markdown, tables } = extractMarkdownTables(m.content);
  const processed = await remark().use(html).process(markdown);
  const { html: contentHtml, toc } = injectHeadingIdsAndBuildToc(
    restoreMarkdownTables(processed.toString(), tables)
  );
  return {
    slug,
    contentHtml,
    toc,
    faq: (m.data.faq as FaqItem[] | undefined) ?? [],
    tldr: (m.data.tldr as string[] | undefined) ?? [],
    title: m.data.title as string,
    category: m.data.category as string,
    date: m.data.date as string,
    updated: m.data.updated as string | undefined,
    excerpt: m.data.excerpt as string,
    noindex: Boolean(m.data.noindex),
  };
}
