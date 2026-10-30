"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = "ca-pub-4630812027939211";

// 審査通過後に、AdSenseで作成した「ディスプレイ広告」ユニットのIDを環境変数に設定すると表示されます。未設定なら何も出しません。
export default function AdUnit({ slot }: { slot?: string }) {
  useEffect(() => {
    if (!slot) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // 広告の読み込み失敗でページ表示は止めない
    }
  }, [slot]);

  if (!slot) return null;
  return (
    <aside aria-label="広告" style={{ margin: "40px 0" }}>
      <p style={{ fontSize: 10, color: "#B0BBCC", margin: "0 0 4px" }}>広告</p>
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={ADSENSE_CLIENT} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
