/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./editor/templates/editor/**/*.{html,js}"],
  theme: {
    screens:{
      '2xs': '320px',
      'xs': '375px',
      'sm': '425px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
    },
  },
  plugins: [],
}

