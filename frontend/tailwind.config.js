/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      text: "rgb(var(--text-color) / <alpha-value>)",
      background: "rgb(var(--background-color) / <alpha-value>)",
      primary: "rgb(var(--primary-color) / <alpha-value>)",
      secondary: "rgb(var(--secondary-color) / <alpha-value>)",
      accent: "rgb(var(--accent-color) / <alpha-value>)",
      transparent: "transparent",
    },
    extend: {},
  },
  plugins: [],
};
