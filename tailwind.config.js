/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#66BB6A',
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
        },
        secondary: {
          light: '#FFD54F',
          DEFAULT: '#FFC107',
          dark: '#FFA000',
        },
        accent: {
          light: '#81D4FA',
          DEFAULT: '#29B6F6',
          dark: '#0288D1',
        },
        success: {
          light: '#A5D6A7',
          DEFAULT: '#66BB6A',
          dark: '#388E3C',
        },
        warning: {
          light: '#FFE082',
          DEFAULT: '#FFD54F',
          dark: '#FFA000',
        },
        error: {
          light: '#EF9A9A',
          DEFAULT: '#EF5350',
          dark: '#D32F2F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
