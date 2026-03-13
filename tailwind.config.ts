import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: "#050812",
        midnight: "#081220",
        storm: "#102239",
        royal: "#17345A",
        steel: "#20334D",
        gold: {
          300: "#F2DC8D",
          400: "#D9B55E",
          500: "#B78B3C",
          600: "#7E5A22",
          700: "#584019",
        },
      },
      boxShadow: {
        gold: "0 0 30px rgba(217, 181, 94, 0.24)",
        panel: "0 30px 80px rgba(0, 0, 0, 0.42)",
        frame: "0 0 0 1px rgba(242,220,141,0.08), 0 32px 88px rgba(0, 0, 0, 0.62)",
        aura: "0 0 42px rgba(217, 181, 94, 0.18)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(50, 88, 150, 0.28), transparent 42%), radial-gradient(circle at 20% 20%, rgba(217, 181, 94, 0.18), transparent 30%), linear-gradient(180deg, rgba(4,8,18,0.94) 0%, rgba(3,6,14,0.98) 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },
      letterSpacing: {
        epic: "0.18em",
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite alternate",
        shimmer: "shimmer 4s linear infinite",
        float: "float 9s ease-in-out infinite",
        pulseSlow: "pulseSlow 6s ease-in-out infinite",
        ember: "ember 12s ease-in-out infinite",
        slowSpin: "slowSpin 22s linear infinite",
        sigil: "sigil 7s ease-in-out infinite",
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translate3d(-4%, -1%, 0) scale(1)" },
          "100%": { transform: "translate3d(4%, 2%, 0) scale(1.08)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(220%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        ember: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)", opacity: "0.12" },
          "50%": { transform: "translate3d(0, -18px, 0) scale(1.16)", opacity: "0.45" },
        },
        slowSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        sigil: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.65" },
          "50%": { transform: "scale(1.035)", opacity: "0.95" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
