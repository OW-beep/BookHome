import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export type Crumb = { label: string; href?: string };

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p === "/" ? "" : p}`);

export default function Breadcrumbs({ items, currentPath }: { items: Crumb[]; currentPath?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const p = item.href ?? (i === items.length - 1 ? currentPath : undefined);
      return { "@type": "ListItem", position: i + 1, name: item.label, ...(p ? { item: abs(p) } : {}) };
    }),
  };
  return (
    <nav aria-label="パンくずリスト" style={{ marginBottom: 20 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 6, fontSize: 12, color: "#7A88A3" }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 6 }}>
            {item.href ? <Link href={item.href} style={{ color: "#7A88A3" }}>{item.label}</Link> : <span style={{ color: "#33415C" }}>{item.label}</span>}
            {i < items.length - 1 && <span style={{ color: "#B0BBCC" }}>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
