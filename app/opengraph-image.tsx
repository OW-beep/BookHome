import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "ブックホーム";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPINES = [
  "#FFC94A",
  "#7EC98C",
  "#7FB8E0",
  "#B9A6E0",
  "#F4A672",
  "#FF8FA0",
  "#7EC98C",
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 100%)",
        }}
      >
        <svg width="200" height="200" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 10L54 20V52C54 52 44 46 32 46C20 46 10 52 10 52V20L32 10Z"
            fill="#FFC94A"
            stroke="#33415C"
            strokeWidth="3"
          />
          <path d="M32 10V46" stroke="#33415C" strokeWidth="3" />
        </svg>

        <div style={{ display: "flex", gap: 12, marginTop: 44 }}>
          {SPINES.map((color, i) => (
            <div
              key={i}
              style={{
                width: 60,
                height: 170 - (i % 3) * 14,
                borderRadius: "10px 10px 5px 5px",
                background: color,
                boxShadow: "inset -5px 0 0 rgba(0,0,0,0.08)",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            width: 560,
            height: 18,
            marginTop: -4,
            borderRadius: 6,
            background: "linear-gradient(180deg, #C98A54 0%, #A66A3D 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
