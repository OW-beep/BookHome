export type ShareImageParams = {
  familyName: string;
  monthCount: number;
  totalBooks: number;
  level: number;
  levelTitle: string;
};

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function generateShareImage(params: ShareImageParams): string {
  const canvas = document.createElement("canvas");
  const size = 600;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // 背景
  const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
  bgGrad.addColorStop(0, "#EAF4FB");
  bgGrad.addColorStop(1, "#F3F8FC");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // カード
  ctx.fillStyle = "#FFFBF3";
  roundedRect(ctx, 40, 60, size - 80, size - 160, 32);
  ctx.fill();
  ctx.save();
  ctx.shadowColor = "rgba(51,65,92,0.15)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#FFFBF3";
  roundedRect(ctx, 40, 60, size - 80, size - 160, 32);
  ctx.fill();
  ctx.restore();

  const centerX = size / 2;

  // ロゴ絵文字
  ctx.font = "56px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📚🏠", centerX, 160);

  // アプリ名
  ctx.font = "bold 22px 'Hiragino Maru Gothic ProN', 'Yu Gothic', sans-serif";
  ctx.fillStyle = "#33415C";
  ctx.fillText("ブックホーム", centerX, 200);

  // メインメッセージ
  const heading = params.familyName
    ? `${params.familyName}の今月`
    : "今月";
  ctx.font = "bold 30px 'Hiragino Maru Gothic ProN', 'Yu Gothic', sans-serif";
  ctx.fillStyle = "#33415C";
  ctx.fillText(heading, centerX, 270);

  ctx.font = "bold 64px 'Hiragino Maru Gothic ProN', 'Yu Gothic', sans-serif";
  ctx.fillStyle = "#FF8FA0";
  ctx.fillText(`${params.monthCount}冊`, centerX, 350);

  ctx.font = "bold 28px 'Hiragino Maru Gothic ProN', 'Yu Gothic', sans-serif";
  ctx.fillStyle = "#33415C";
  ctx.fillText("読みました！", centerX, 400);

  // レベル称号バッジ
  ctx.font = "bold 16px 'Hiragino Maru Gothic ProN', 'Yu Gothic', sans-serif";
  ctx.fillStyle = "#7A88A3";
  ctx.fillText(
    `としょかん Lv.${params.level}（${params.levelTitle}）・蔵書 ${params.totalBooks}冊`,
    centerX,
    460
  );

  // 本のアイコン列
  const bookCount = Math.min(10, Math.max(1, params.monthCount));
  const emojiRow = "📗".repeat(bookCount);
  ctx.font = "26px sans-serif";
  ctx.fillText(emojiRow, centerX, 510);

  return canvas.toDataURL("image/png");
}
