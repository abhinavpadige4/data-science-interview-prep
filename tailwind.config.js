/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e3af2',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, #a855f7, #9333ea)',
        'glass': 'rgba(255, 255, 255, 0.05)'
      }
    }
  },
  plugins: [],
}