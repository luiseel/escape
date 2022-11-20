/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./layouts/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      background: "#343148",
      foreground: "#D7C49E",
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        sans: ["var(--default-font)", "monospace"],
      },
      borderWidth: {
        base: "3px",
      },
    },
  },
  plugins: [],
};
