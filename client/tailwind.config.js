import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f7f6f2",
        surface: "#ffffff",
        ink: "#182230",
        muted: "#526072",
        line: "#dfe5ec",
        accent: "#b7d5c8",
        accentStrong: "#86b39d",
        sand: "#efe7db",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        glow: "radial-gradient(circle at top left, rgba(183, 213, 200, 0.6), transparent 40%), radial-gradient(circle at bottom right, rgba(239, 231, 219, 0.8), transparent 35%)",
      },
    },
  },
  plugins: [forms, typography],
};
