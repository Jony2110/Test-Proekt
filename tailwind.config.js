/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  colors: {
    'customColor': '#F3F7FA',
    'bgColor': '#F3F4F8',
    'textAhref': '#6A7181',
    'hoverLink': '#232360'

  },
 
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [require('daisyui'),],
}