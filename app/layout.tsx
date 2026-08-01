import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ブックホーム｜家族の本棚を育てる読書記録アプリ",
  description:
    "家族みんなでも、こども専用でも。バーコードで本を登録し、読書記録・読み聞かせ記録・思い出を残せる無料の本棚アプリ。",
  keywords: [
    "読書記録",
    "絵本 記録",
    "読み聞かせ 記録",
    "家族 本棚",
    "蔵書管理",
    "子供 読書 アプリ",
  ],
  openGraph: {
    title: "ブックホーム｜家族の本棚を育てる読書記録アプリ",
    description:
      "家族みんなでも、こども専用でも。バーコードで本を登録し、読書記録・読み聞かせ記録・思い出を残せる無料の本棚アプリ。",
    type: "website",
    locale: "ja_JP",
    siteName: "ブックホーム",
  },
  twitter: {
    card: "summary",
    title: "ブックホーム｜家族の本棚を育てる読書記録アプリ",
    description:
      "家族みんなでも、こども専用でも。バーコードで本を登録し、読書記録・思い出を残せる無料の本棚アプリ。",
  },
  verification: {
    google: "T4_gFHNcVTITCIBRxOFrzaCjgVKhvo4VsrtoMROauXI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
