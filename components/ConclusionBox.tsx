export default function ConclusionBox({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ background: "#FFFBF3", borderLeft: "5px solid #FFC94A", borderRadius: "0 16px 16px 0", padding: "16px 20px", margin: "0 0 28px" }}>
      <p style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 13, margin: "0 0 8px" }}>結論：まずここだけ読めばOK</p>
      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.8 }}>
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
