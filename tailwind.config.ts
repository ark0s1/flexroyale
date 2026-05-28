import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        royale: {
          blue: '#2563EB',
          'blue-light': '#3B82F6',
          'blue-dark': '#1D4ED8',
          gold: '#FBBF24',
          'gold-light': '#FDE68A',
          'gold-dark': '#F59E0B',
          dark: '#07070E',
        },
      },
      fontFamily: {
        gaming: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'count-up': 'countUp 1.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'shine': 'shine 3s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'pulse-blue': 'pulseBlue 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 15px #FBBF2444, 0 0 30px #FBBF2422' },
          '50%': { boxShadow: '0 0 30px #FBBF24AA, 0 0 60px #FBBF2444' },
        },
        pulseBlue: {
          '0%, 100%': { boxShadow: '0 0 15px #2563EB44, 0 0 30px #2563EB22' },
          '50%': { boxShadow: '0 0 30px #2563EBAA, 0 0 60px #2563EB44' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
