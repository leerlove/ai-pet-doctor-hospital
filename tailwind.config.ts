import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#2dd4bf',
          700: '#14b8a6',
          800: '#0d9488',
          900: '#0f766e',
        },
        status: {
          pending: '#f59e0b',
          confirmed: '#10b981',
          cancelled: '#ef4444',
          completed: '#6b7280',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
