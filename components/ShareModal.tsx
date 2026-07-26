"use client";

import { useEffect, useState } from "react";
import { X, Download, Share2 } from "lucide-react";

export default function ShareModal({
  heading,
  showNameInput = true,
  buildShareText,
  buildImage,
  onClose,
}: {
  heading: string;
  showNameInput?: boolean;
  buildShareText: (familyName: string) => string;
  buildImage: (familyName: string) => string;
  onClose: () => void;
}) {
  const [familyName, setFamilyName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && !!navigator.share
    );
  }, []);

  function regenerate() {
    setImageUrl(buildImage(familyName.trim()));
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareText = buildShareText(familyName.trim());

  function shareToX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareToLine() {
    const url = `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function downloadImage() {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "book-home-share.png";
    a.click();
  }

  async function nativeShare() {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "book-home-share.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: shareText,
        });
      } else {
        await navigator.share({ text: shareText });
      }
    } catch {
      // ユーザーがキャンセルした場合など。何もしない
    }
  }

  return (
    <div className="share-backdrop" onClick={onClose}>
      <style>{`
        .share-backdrop { position: fixed; inset: 0; background: rgba(51,65,92,0.35); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 60; }
        .share-modal { background: #FFFBF3; border-radius: 24px; max-width: 420px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 22px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .share-close { position: absolute; top: 16px; right: 16px; background: #EAF4FB; border: none; border-radius: 999px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #33415C; }
        .share-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 18px; margin-bottom: 14px; color: #33415C; }
        .share-field { margin-bottom: 12px; }
        .share-field label { display: block; font-size: 12px; font-weight: 700; color: #7A88A3; margin-bottom: 5px; }
        .share-field input { width: 100%; border: 2px solid #E3ECF3; border-radius: 10px; padding: 9px 12px; font-family: inherit; font-size: 14px; outline: none; box-sizing: border-box; }
        .share-preview { width: 100%; border-radius: 16px; margin: 8px 0 16px; box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
        .share-btn-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .share-btn { flex: 1; min-width: 100px; border: none; border-radius: 12px; padding: 10px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .share-btn-x { background: #000; color: #fff; }
        .share-btn-line { background: #06C755; color: #fff; }
        .share-btn-native { background: #7FB8E0; color: #fff; }
        .share-btn-download { background: #33415C; color: #fff; }
      `}</style>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="share-close" onClick={onClose}><X size={16} /></button>
        <div className="share-title">📤 {heading}</div>

        {showNameInput && (
          <div className="share-field">
            <label>表示する名前（任意・例：田中家）</label>
            <input
              placeholder="未入力の場合は表示されません"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              onBlur={regenerate}
            />
          </div>
        )}

        {imageUrl && <img className="share-preview" src={imageUrl} alt="シェア画像プレビュー" />}

        <div className="share-btn-row">
          {canNativeShare && (
            <button className="share-btn share-btn-native" onClick={nativeShare}>
              <Share2 size={14} /> シェアする
            </button>
          )}
          <button className="share-btn share-btn-x" onClick={shareToX}>Xでシェア</button>
          <button className="share-btn share-btn-line" onClick={shareToLine}>LINEでシェア</button>
          <button className="share-btn share-btn-download" onClick={downloadImage}>
            <Download size={14} /> 画像を保存
          </button>
        </div>
        <p style={{ fontSize: 10, color: "#B0BBCC", marginTop: 10 }}>
          Instagramには直接投稿するボタンがないため、「画像を保存」してから投稿してください（スマホの場合は「シェアする」からも投稿できることがあります）。
        </p>
      </div>
    </div>
  );
}
