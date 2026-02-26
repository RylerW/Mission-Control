/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#101727',
        panel: '#172236',
        border: '#263249'
      }
    }
  },
  plugins: []
};
