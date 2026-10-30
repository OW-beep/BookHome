// サイト共通の定数。独自ドメインを変更する場合は、ここと Vercel の環境変数 NEXT_PUBLIC_SITE_URL を揃えてください。
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bookhome.jp"
).replace(/\/$/, "");
export const SITE_NAME = "ブックホーム";
export const CONTACT_EMAIL = "bookhome26.info@gmail.com";
