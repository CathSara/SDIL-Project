import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'beige-green': '#a1b0a4',
        'mint-green': '#f1efe1',
        'dark-green': '#305626',
        'lighter-green': '#c4cbba',
      },
    },
  },
  plugins: [],
} satisfies Config;
