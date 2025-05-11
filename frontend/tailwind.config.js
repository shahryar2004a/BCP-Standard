/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        yekanBakh: ['Yekan Bakh', 'sans-serif'], // معرفی فونت Yekan Bakh
      },
      fontWeight: {
        heavy: 700,   // وزن Heavy
        light: 300,   // وزن Light
        medium: 500,  // وزن Medium
      },
    },
  },
  plugins: [],
}

