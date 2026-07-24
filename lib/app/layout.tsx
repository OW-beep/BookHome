import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ブックホーム",
  description: "家族みんなでも、こども専用でも。家族の本棚を育てよう。",
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
