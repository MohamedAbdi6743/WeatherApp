/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

/*
 * Design tokens. Use these names in components instead of raw values.
 *
 * Radius rule for nested shapes: inner radius = outer radius - padding.
 *   card  20px, padding card-inset  8px -> item        12px
 *   field 12px, padding field-inset 4px -> field-inner  8px
 */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F7F5",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#18181B", // 17.7:1 on white
          muted: "#52525B", // 7.7:1
          subtle: "#71717A", // 4.8:1, smallest allowed text colour
        },
        line: {
          DEFAULT: "#E4E4E7",
          strong: "#D4D4D8",
        },
        accent: {
          DEFAULT: "#C2410C", // white text 5.2:1
          hover: "#9A3412",
          soft: "#FFF4ED",
          ring: "#FDBA74",
        },
        danger: {
          DEFAULT: "#B91C1C",
          soft: "#FEF2F2",
        },
        success: {
          DEFAULT: "#15803D",
          soft: "#F0FDF4",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        card: "20px",
        item: "12px",
        field: "12px",
        "field-inner": "8px",
      },
      spacing: {
        "card-inset": "8px",
        "field-inset": "4px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-4px)" },
          "40%, 80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 240ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
        pop: "pop 320ms cubic-bezier(0.3, 1.5, 0.6, 1)",
        shake: "shake 320ms ease-in-out",
      },
    },
  },
  plugins: [],
};
