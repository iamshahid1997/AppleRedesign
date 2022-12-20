/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: '#e7ecee',
        },
        darkBackground: {
          DEFAULT: '#1b1b1b',
        },
      },
    },
  },
  plugins: [],
};
