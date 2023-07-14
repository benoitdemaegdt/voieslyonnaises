/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        official: '#019438',
        'lvv-blue-600': '#152B68',
        'lvv-blue-500': '#433E61',
        'lvv-blue-400': '#665E7B',
        'lvv-blue-300': '#C2BDC3',
        'lvv-blue-200': '#DEDBDD',
        'lvv-blue-100': '#EFEDF1',
        'lvv-pink': '#C84271',
        'lvv-green': '#83C0B7'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
