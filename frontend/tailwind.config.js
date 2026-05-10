/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef9f0',
          100: '#fef0d0',
          200: '#fcd98a',
          300: '#f9c23a',
          400: '#f5a623',
          500: '#e8941a',
          600: '#c97a10',
          700: '#a5620c',
          800: '#834e0a',
          900: '#6b3e08',
        },
        dark: {
          950: '#0a0a0a',
          900: '#111111',
          800: '#1c1c1c',
          700: '#2a2a2a',
          600: '#3d3d3d',
          500: '#555555',
          400: '#777777',
          300: '#999999',
          200: '#bbbbbb',
          100: '#dddddd',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
