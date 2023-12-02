import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      primary: "rgb(var(--primary-color) / <alpha-value>)",
      designer: "rgb(var(--designer-color) / <alpha-value>)",
      producer: "rgb(var(--producer-color) / <alpha-value>)",
      "call-to-action": "rgb(var(--call-to-action-color) / <alpha-value>)",
      error: "rgb(var(--error-color) / <alpha-value>)",
      background: "rgb(var(--background-color) / <alpha-value>)",
      "body-text": "rgb(var(--body-text-color) / <alpha-value>)",
      inactivity: "rgb(var(--inactivity-color) / <alpha-value>)",
    },
    fontFamily: {
      display: ["SF Pro Display Bold", ...defaultTheme.fontFamily.sans],
      sans: ["SF Pro Display Regular", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      animation: {
        rotateOpen: "rotateOpen 0.2s ease-in-out",
        rotateClose: "rotateClose 0.2s ease-in-out",
        slideIn: "slideIn 0.2s ease-in-out",
        slideOut: "slideOut 0.2s ease-in-out",
      },
      keyframes: {
        rotateOpen: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-90deg)" },
        },
        rotateClose: {
          "0%": { transform: "rotate(90deg)" },
          "100%": { transform: "rotate(0)" },
        },
        slideIn: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(252px)" },
        },
        slideOut: {
          "0%": { transform: "translateY(252px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
