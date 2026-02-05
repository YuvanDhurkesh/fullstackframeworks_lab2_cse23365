/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel1: '#F0F4F8',
        pastel2: '#D1E9FF',
        gold: '#FFD700',
      },
      borderRadius: {
        'xl': '1.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
