/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-green": "#4B6A4F",
        primary: {
          50: "#f0f9f0",
          100: "#dcf2dc",
          200: "#bce5bc",
          300: "#8fd18f",
          400: "#5cb85c",
          500: "#4B6A4F",
          600: "#3d5a41",
          700: "#334a36",
          800: "#2a3a2c",
          900: "#233125",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
