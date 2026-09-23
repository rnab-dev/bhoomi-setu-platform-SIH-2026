import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          2: "#14b8a6",
          dark: "#0b5c54",
          tint: "#e0f5f1",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ink: {
          DEFAULT: "#0a1120",
          2: "#121b2c",
          soft: "#22314a",
        },
        paper: {
          DEFAULT: "#f2f4f9",
          2: "#ffffff",
        },
        line: {
          DEFAULT: "#e2e6ee",
          soft: "#edf0f6",
        },
        text: {
          DEFAULT: "#141c2b",
          mute: "#5b6879",
          faint: "#8b97a8",
        },
        violet: {
          DEFAULT: "#6d5bd0",
          tint: "#ece9fb",
        },
        gold: {
          DEFAULT: "#c2903f",
          tint: "#faf1e0",
        },
        brick: {
          DEFAULT: "#c04732",
          tint: "#fbe9e5",
        },
        slate: {
          DEFAULT: "#3170c2",
          tint: "#e8f0fb",
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "9px",
        lg: "18px",
      },
      boxShadow: {
        DEFAULT: "0 1px 2px rgba(15,23,42,.05), 0 6px 20px rgba(15,23,42,.06)",
        md: "0 6px 20px rgba(15,23,42,.10)",
        lg: "0 28px 70px rgba(10,17,32,.28)",
        glow: "0 8px 24px rgba(14,138,122,.28)",
      }
    },
  },
  plugins: [],
};

export default config;
