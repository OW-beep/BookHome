import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    card: "summary_large_image",
    title: "ブックホーム｜家族の本棚を育てる読書記録アプリ",
    description:
      "家族みんなでも、こども専用でも。バーコードで本を登録し、読書記録・思い出を残せる無料の本棚アプリ。",
  },
  verification: {
    google: "T4_gFHNcVTITCIBRxOFrzaCjgVKhvo4VsrtoMROauXI",
  },
  other: {
    "google-adsense-account": "ca-pub-4630812027939211",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "家族みんなでも、こども専用でも。バーコードで本を登録できる無料の読書記録アプリと、本・読書の困りごとにこたえる読みもの。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ja">
      <head>
        {/* Google AdSense（審査用コード。クローラーが初期HTMLで検出できるよう素の<script>で記述） */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4630812027939211"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
