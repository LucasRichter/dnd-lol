/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      // that is animation class
      animation: {
        fade: 'fadeOut 1s linear',
      },

      // that is actual animation
      keyframes: theme => ({
        fadeOut: {
          '0%': { left: -100 },
          '80%': { left: 0 },
        },
      }),
    },
  },
  plugins: [],
}
