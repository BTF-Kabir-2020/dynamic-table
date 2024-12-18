import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#ff6347",
        secondary: "#4caf50",
      },
    },
  },
  darkMode: "class", // یا 'media' برای فعال‌سازی حالت تاریک
  plugins: [],
} satisfies Config;
