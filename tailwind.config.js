/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    colors: {
      background: "#A8C64E",
      foreground: "#3C412C",
    },
    extend: {
      fontFamily: {
        sans: ["VT323", "monospaced"],
      },
    },
  },
  plugins: [],
};
