/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./layouts/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      background: "#3C412C",
      foreground: "#A8C64E",
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        sans: ["VT323", "monospace"],
      },
    },
  },
  plugins: [],
};
