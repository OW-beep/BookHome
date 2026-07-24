import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: "#EAF4FB",
        paper: "#FFFBF3",
        wood: "#C98A54",
        woodDark: "#A66A3D",
        coral: "#FF8FA0",
        sun: "#FFC94A",
        leaf: "#7EC98C",
        ink: "#33415C",
        lavender: "#B9A6E0",
        muted: "#7A88A3",
      },
    },
  },
  plugins: [],
};
export default config;
