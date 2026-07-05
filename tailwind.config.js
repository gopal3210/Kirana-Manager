/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f2',
          100: '#dcebdc',
          200: '#b8d6b9',
          300: '#8fbd91',
          400: '#5fa063',
          500: '#3f8143',
          600: '#2f6633',
          700: '#27522a',
          800: '#224425',
          900: '#1c3820',
        },
        amber: {
          50: '#fdf8ed',
          100: '#faecc8',
          200: '#f5d78e',
          300: '#efbe54',
          400: '#eaa62b',
          500: '#df8f18',
          600: '#c26f12',
          700: '#9c5313',
          800: '#7e4315',
          900: '#693916',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
