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
    extend: {},
  },
  plugins: [],
};
