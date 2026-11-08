/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        slate: {
        50: 'rgb(var(--slate-50) / <alpha-value>)',
        100: 'rgb(var(--slate-100) / <alpha-value>)',
        200: 'rgb(var(--slate-200) / <alpha-value>)',
        300: 'rgb(var(--slate-300) / <alpha-value>)',
        400: 'rgb(var(--slate-400) / <alpha-value>)',
        500: 'rgb(var(--slate-500) / <alpha-value>)',
        600: 'rgb(var(--slate-600) / <alpha-value>)',
        700: 'rgb(var(--slate-700) / <alpha-value>)',
        800: 'rgb(var(--slate-800) / <alpha-value>)',
        900: 'rgb(var(--slate-900) / <alpha-value>)',
        },
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)', 100: 'rgb(var(--brand-100) / <alpha-value>)', 200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: '#bdb4fe', 400: '#9b8afb', 500: '#7a5af8', 600: '#6938ef',
          700: 'rgb(var(--brand-700) / <alpha-value>)', 800: '#4a1fb8', 900: '#3e1c96',
        },
      },
      boxShadow: { card: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)' },
    },
  },
  plugins: [],
};
