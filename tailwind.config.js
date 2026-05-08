/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dominoRed: "#e41134",
        dominoBlue: "#006492",
        dominoWhite: "#ffffff",
      }
    },
  },
  plugins: [],
}
