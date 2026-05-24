/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0D10',
        elevated: '#12151A',
        surface: {
          1: '#181C22',
          2: '#1F2430',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
        },
        text: {
          primary: '#EDEFF3',
          secondary: '#9AA3B2',
          muted: '#6B7280',
        },
        accent: {
          DEFAULT: '#7C9CFF',
          hover: '#98B1FF',
        },
        risk: {
          low: '#4ADE80',
          medium: '#FBBF24',
          high: '#F87171',
          critical: '#EF4444',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        content: '42rem',
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
