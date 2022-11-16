/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./layouts/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      background: "#348597",
      foreground: "#F4A896",
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        sans: ["var(--default-font)", "monospace"],
      },
      borderWidth: {
        base: "4px",
      },
    },
  },
  plugins: [],
};
