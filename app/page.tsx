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

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ctaHref = user ? "/library" : "/login";
  const ctaLabel = user ? "本棚を開く" : "無料ではじめる";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 420px, #F3F8FC 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap');
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

        <div className="lp-features">
          {FEATURES.map((f) => (
            <div className="lp-feature-card" key={f.title}>
              <div className="lp-feature-icon">{f.icon}</div>
              <div className="lp-feature-title">{f.title}</div>
              <div className="lp-feature-text">{f.text}</div>
            </div>
          ))}
        </div>

        <div className="lp-footer">ブックホーム — データはログイン後、あなたの本棚として安全に保存されます</div>
      </div>
    </div>
  );
}
