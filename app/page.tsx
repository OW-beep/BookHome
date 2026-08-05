import React from "react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PREVIEW_BOOKS = [
  { title: "ぐりとぐらの おおきなケーキ", color: "#FFC94A" },
  { title: "きょうりゅう大図鑑", color: "#7EC98C" },
  { title: "おしいれのぼうけん", color: "#7FB8E0" },
  { title: "はじめての宇宙図鑑", color: "#B9A6E0" },
  { title: "そらとぶパン工場", color: "#F4A672" },
];

const FEATURES = [
  { icon: "📷", title: "バーコードでかんたん登録", text: "本の裏表紙をカメラで映すだけで、タイトル・著者・表紙を自動取得" },
  { icon: "🔍", title: "図書館の本もタイトル検索でOK", text: "バーコードが手元になくても、タイトルで探して登録できます" },
  { icon: "📚", title: "家族みんなの本棚", text: "だれの本かを気にせず、1つの本棚にまとめて記録" },
  { icon: "📖", title: "読み聞かせも記録", text: "一人読みか読み聞かせか、読んだ日・読んだ人まで残せます" },
  { icon: "📊", title: "統計でふりかえり", text: "読んだ冊数・ジャンルの傾向・お気に入りの作者が一目でわかる" },
  { icon: "🏆", title: "としょかんレベル", text: "読めば読むほど「としょかん」が育つ、ちょっとしたゲーム要素つき" },
];

const STEPS = [
  { num: "1", icon: "📷", title: "スキャンする", text: "本の裏表紙のバーコードをカメラで映すだけ" },
  { num: "2", icon: "✅", title: "自動で登録", text: "タイトル・著者・表紙が自動で入力される" },
  { num: "3", icon: "📚", title: "読んで記録", text: "読んだら記録。としょかんがどんどん育つ" },
];

const FAQS = [
  { q: "本当に無料ですか？", a: "はい、すべての機能を無料でお使いいただけます。今後も基本機能を無料で提供し続ける予定です。" },
  { q: "登録したデータは消えませんか？", a: "アカウント登録（メールログイン）をしていただければ、データはクラウド上に安全に保存され、機種変更やブラウザを変えても消えません。" },
  { q: "子どもが自分で使っても大丈夫ですか？", a: "本の登録や読書記録の操作はシンプルなので、お子さんが自分で触っても問題ない設計です。ログイン自体は保護者の方が行うことをおすすめします。" },
  { q: "家族みんなで共有できますか？", a: "1つのログインを家族で共有する形で、家族全員の読書記録を1つの本棚にまとめられます。「読んだ人」を家族メンバーごとに記録することもできます。" },
  { q: "スマホとパソコン、どちらで使えますか？", a: "どちらでもお使いいただけます。バーコードスキャンにはカメラ付きの端末（スマホ・PC）が必要です。" },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ctaHref = user ? "/library" : "/login";
  const ctaLabel = user ? "本棚を開く" : "無料ではじめる";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ブックホーム",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    description:
      "家族みんなでも、こども専用でも。バーコードで本を登録し、読書記録・読み聞かせ記録・思い出を残せる無料の本棚アプリ。",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 420px, #F3F8FC 100%)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        .lp-body { font-family: 'M PLUS Rounded 1c', sans-serif; color: #33415C; }
        .lp-hero { max-width: 720px; margin: 0 auto; padding: 56px 20px 24px; text-align: center; }
        .lp-logo-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .lp-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 32px; margin: 0; }
        .lp-tagline { font-size: 15px; color: #7A88A3; margin-top: 10px; }
        .lp-sub { font-size: 13px; color: #7A88A3; margin-top: 4px; line-height: 1.7; }
        .lp-cta { display: inline-block; margin-top: 24px; background: #FF8FA0; color: #fff; text-decoration: none; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 999px; box-shadow: 0 5px 0 #E06B7D; }
        .lp-shelf-wrap { max-width: 640px; margin: 32px auto 0; padding: 0 20px; }
        .lp-spines { display: flex; align-items: flex-end; justify-content: center; gap: 4px; min-height: 130px; padding-top: 10px; }
        .lp-spine { width: 42px; height: 120px; border-radius: 6px 6px 3px 3px; display: flex; align-items: flex-start; justify-content: center; padding: 8px 3px; box-shadow: inset -3px 0 0 rgba(0,0,0,0.08), 0 3px 4px rgba(0,0,0,0.12); }
        .lp-spine span { writing-mode: vertical-rl; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 11px; color: rgba(0,0,0,0.6); }
        .lp-plank { height: 16px; background: linear-gradient(180deg, #C98A54 0%, #A66A3D 100%); border-radius: 4px; box-shadow: 0 6px 0 rgba(0,0,0,0.08), 0 8px 10px rgba(166,106,61,0.25); margin-top: -4px; }
        .lp-features { max-width: 900px; margin: 56px auto 0; padding: 0 20px 64px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .lp-feature-card { background: #FFFBF3; border-radius: 18px; padding: 20px; box-shadow: 0 3px 0 rgba(51,65,92,0.06); }
        .lp-feature-icon { font-size: 26px; }
        .lp-feature-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 14px; margin: 8px 0 4px; }
        .lp-feature-text { font-size: 12px; color: #7A88A3; line-height: 1.6; }
        .lp-footer { text-align: center; font-size: 11px; color: #B0BBCC; padding-bottom: 40px; }

        .lp-section-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 26px; text-align: center; margin: 0 0 40px; }
        .lp-steps { max-width: 900px; margin: 80px auto 0; padding: 0 20px; }
        .lp-steps-row { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        .lp-step-card { background: #FFFBF3; border-radius: 20px; padding: 28px 24px; text-align: center; width: 220px; box-shadow: 0 3px 0 rgba(51,65,92,0.06); position: relative; }
        .lp-step-num { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #FF8FA0; color: #fff; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 14px; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 0 #E06B7D; }
        .lp-step-icon { font-size: 40px; margin-top: 8px; }
        .lp-step-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 16px; margin: 10px 0 6px; }
        .lp-step-text { font-size: 12px; color: #7A88A3; line-height: 1.6; }
        .lp-step-arrow { align-self: center; font-size: 28px; color: #B9CBDD; }

        .lp-preview { max-width: 900px; margin: 90px auto 0; padding: 0 20px; }
        .lp-preview-mock { background: #FFFBF3; border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(51,65,92,0.1); max-width: 480px; margin: 0 auto; }
        .lp-preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .lp-preview-level { background: #EAF4FB; border-radius: 999px; padding: 6px 14px; font-size: 11px; font-weight: 700; color: #33415C; }
        .lp-preview-stats { display: flex; gap: 8px; margin-bottom: 18px; }
        .lp-preview-stat { flex: 1; background: #EAF4FB; border-radius: 12px; padding: 10px; text-align: center; }
        .lp-preview-stat-num { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 18px; color: #33415C; }
        .lp-preview-stat-label { font-size: 10px; color: #7A88A3; }
        .lp-preview-cal { display: grid; grid-template-columns: repeat(14, 1fr); gap: 3px; }
        .lp-preview-cell { aspect-ratio: 1; border-radius: 2px; }
        .lp-preview-badges { display: flex; gap: 8px; margin-top: 16px; }
        .lp-preview-badge { flex: 1; background: #FFFDF3; border-radius: 10px; padding: 8px; text-align: center; font-size: 20px; box-shadow: 0 2px 0 rgba(255,201,74,0.4); }

        .lp-faq { max-width: 700px; margin: 90px auto 0; padding: 0 20px 30px; }
        .lp-faq-item { background: #FFFBF3; border-radius: 16px; padding: 18px 22px; margin-bottom: 10px; }
        .lp-faq-q { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 15px; display: flex; gap: 8px; }
        .lp-faq-a { font-size: 13px; color: #7A88A3; margin-top: 8px; line-height: 1.7; padding-left: 24px; }
      `}</style>
      <div className="lp-body">
        <div className="lp-hero">
          <div className="lp-logo-row">
            <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
              <path d="M32 10L54 20V52C54 52 44 46 32 46C20 46 10 52 10 52V20L32 10Z" fill="#FFC94A" stroke="#33415C" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M32 10V46" stroke="#33415C" strokeWidth="3"/>
            </svg>
            <h1 className="lp-title">ブックホーム</h1>
          </div>
          <p className="lp-tagline">家族みんなの本棚を、思い出と一緒に育てよう。</p>
          <p className="lp-sub">
            家族みんなでも、こども専用でも。バーコードでかんたん登録、読んだ記録も思い出もまとめて残せる本棚アプリです。
          </p>
          <a className="lp-cta" href={ctaHref}>{ctaLabel}</a>
        </div>

        <div className="lp-shelf-wrap">
          <div className="lp-spines">
            {PREVIEW_BOOKS.map((b) => (
              <div className="lp-spine" style={{ background: b.color }} key={b.title}>
                <span>{b.title}</span>
              </div>
            ))}
          </div>
          <div className="lp-plank" />
        </div>

        <div className="lp-steps">
          <h2 className="lp-section-title">つかいかたは3ステップ</h2>
          <div className="lp-steps-row">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="lp-step-card">
                  <div className="lp-step-num">{s.num}</div>
                  <div className="lp-step-icon">{s.icon}</div>
                  <div className="lp-step-title">{s.title}</div>
                  <div className="lp-step-text">{s.text}</div>
                </div>
                {i < STEPS.length - 1 && <div className="lp-step-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="lp-preview">
          <h2 className="lp-section-title">育っていく「としょかん」</h2>
          <div className="lp-preview-mock">
            <div className="lp-preview-header">
              <span style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 14 }}>としょかんの統計</span>
              <span className="lp-preview-level">Lv.8 図書館の住人</span>
            </div>
            <div className="lp-preview-stats">
              <div className="lp-preview-stat">
                <div className="lp-preview-stat-num">42</div>
                <div className="lp-preview-stat-label">さつ蔵書</div>
              </div>
              <div className="lp-preview-stat">
                <div className="lp-preview-stat-num">86</div>
                <div className="lp-preview-stat-label">回よんだ</div>
              </div>
              <div className="lp-preview-stat">
                <div className="lp-preview-stat-num">12</div>
                <div className="lp-preview-stat-label">日連続</div>
              </div>
            </div>
            <div className="lp-preview-cal">
              {Array.from({ length: 42 }).map((_, i) => {
                const intensity = [0, 1, 1, 2, 0, 3, 1, 0, 2, 1, 0, 0, 2, 3][i % 14];
                const colors = ["#E3ECF3", "#B9E3C6", "#7EC98C", "#3F9457"];
                return <div className="lp-preview-cell" style={{ background: colors[intensity] }} key={i} />;
              })}
            </div>
            <div className="lp-preview-badges">
              <div className="lp-preview-badge">📗</div>
              <div className="lp-preview-badge">🌙</div>
              <div className="lp-preview-badge" style={{ opacity: 0.35 }}>🏆</div>
              <div className="lp-preview-badge" style={{ opacity: 0.35 }}>👶</div>
            </div>
          </div>
        </div>

        <div className="lp-features">
          {FEATURES.map((f) => (
            <div className="lp-feature-card" key={f.title}>
              <div className="lp-feature-icon">{f.icon}</div>
              <div className="lp-feature-title">{f.title}</div>
              <div className="lp-feature-text">{f.text}</div>
            </div>
          ))}
        </div>

        <div className="lp-faq">
          <h2 className="lp-section-title">よくある質問</h2>
          {FAQS.map((f) => (
            <div className="lp-faq-item" key={f.q}>
              <div className="lp-faq-q">Q. {f.q}</div>
              <div className="lp-faq-a">A. {f.a}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 60 }}>
          <a className="lp-cta" href={ctaHref}>{ctaLabel}</a>
        </div>

        <div className="lp-footer">
          ブックホーム — データはログイン後、あなたの本棚として安全に保存されます
          <br />
          <a href="/privacy" style={{ color: "#B0BBCC" }}>プライバシーポリシー</a>
          {" ・ "}
          <a href="/terms" style={{ color: "#B0BBCC" }}>利用規約</a>
        </div>
      </div>
    </div>
  );
}
