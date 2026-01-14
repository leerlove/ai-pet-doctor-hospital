import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 기존 primary (teal 계열) 유지
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
        // Stitch 디자인 색상
        'stitch': {
          primary: '#2d6a7b',
          'primary-dark': '#1e4b58',
        },
        'accent-sage': '#A3D9B5',
        'alert-red': '#ef4444',
        'background-light': '#f9fafa',
        'background-dark': '#22262a',
        'surface-light': '#ffffff',
        'surface-dark': '#2d3238',
        'text-main': '#131516',
        'text-subtle': '#6b7b80',
        // 기존 status 색상
        status: {
          pending: '#f59e0b',
          confirmed: '#10b981',
          cancelled: '#ef4444',
          completed: '#6b7280',
        },
      },
      fontFamily: {
        display: ['Noto Sans KR', 'sans-serif'],
        body: ['Noto Sans KR', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config
