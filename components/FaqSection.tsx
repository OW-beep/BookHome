import type { FaqItem } from "@/lib/posts";

export default function FaqSection({ items }: { items: FaqItem[] }) {
  if (!items || items.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };
  return (
    <section style={{ marginTop: 48 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 20, margin: "0 0 14px" }}>よくある質問</h2>
      {items.map((it, i) => (
        <div key={i} style={{ background: "#FFFBF3", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 6px" }}>Q. {it.q}</p>
          <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0, color: "#4A5873" }}>A. {it.a}</p>
        </div>
      ))}
    </section>
  );
}
