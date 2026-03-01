/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        surface: "#101727",
        panel: "#172236",
        border: "#263249",
      },
    },
  },

  plugins: [],
};
