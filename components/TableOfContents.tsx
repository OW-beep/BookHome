import type { TocItem } from "@/lib/posts";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;
  return (
    <nav aria-label="目次" style={{ background: "#fff", border: "1px solid #D9E4EF", borderRadius: 16, padding: "16px 20px", margin: "0 0 32px" }}>
      <p style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 14, margin: "0 0 8px" }}>目次</p>
      <ol style={{ margin: 0, paddingLeft: 22, fontSize: 14, lineHeight: 1.9 }}>
        {items.map((it) => (
          <li key={it.id}><a href={`#${it.id}`} style={{ color: "#4E93C4" }}>{it.text}</a></li>
        ))}
      </ol>
    </nav>
  );
}
