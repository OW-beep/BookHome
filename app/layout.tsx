import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
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

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}

        {/* Vercel Analytics: 環境変数の設定不要。Vercelにデプロイするだけで自動計測されます */}
        <Analytics />

        {/* Google Analytics 4: NEXT_PUBLIC_GA_MEASUREMENT_ID を設定した場合のみ読み込まれます */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
