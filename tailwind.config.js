/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#0f1117',
          900: '#1a1d2e',
          800: '#232640',
          700: '#2d3148',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'PingFang SC', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
