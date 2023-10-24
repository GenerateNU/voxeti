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
    extend: {
      animation: {
        rotateOpen: "rotateOpen 0.2s ease-in-out",
        rotateClose: "rotateClose 0.2s ease-in-out",
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
      },
    },
  },
  plugins: [],
};
