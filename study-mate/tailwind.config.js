import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
          500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
        },
        secondary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8',
          500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(15, 23, 42, 0.10), 0 10px 20px -2px rgba(15, 23, 42, 0.04)',
        card: '0 0 0 1px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.06)',
        hover: '0 0 0 1px rgba(15, 23, 42, 0.05), 0 10px 25px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [typography],
}
