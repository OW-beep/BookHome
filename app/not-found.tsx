import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "ページが見つかりません｜ブックホーム",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 20px 0", fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#33415C", lineHeight: 1.9, textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>📚</div>
        <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 22 }}>ページが見つかりませんでした</h1>
        <p style={{ fontSize: 14, color: "#7A88A3" }}>
          お探しのページは、移動したか、なくなった可能性があります。
        </p>
        <p style={{ marginTop: 28 }}>
          <Link href="/articles" style={{ color: "#4E93C4" }}>読みもの一覧を見る</Link>
          {" ・ "}
          <Link href="/" style={{ color: "#4E93C4" }}>トップページに戻る</Link>
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
