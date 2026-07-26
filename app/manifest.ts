import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ブックホーム - 家族の本棚",
    short_name: "ブックホーム",
    description: "家族みんなでも、こども専用でも。家族の本棚を育てよう。",
    start_url: "/library",
    display: "standalone",
    background_color: "#F3F8FC",
    theme_color: "#FF8FA0",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
