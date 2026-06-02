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
        // Palette terreuse Bauhaus (aplats, pas de violet)
        bone: '#ECE6D8',
        sand: '#D9CDB8',
        clay: '#9C7A5B',
        terracotta: '#C0573B',
        ochre: '#C8902E',
        olive: '#8A8B4A',
        dustyblue: '#6E8C9E',
        stone: '#8A847A',
        espresso: '#1C1A17',
        ink: '#13110E',
        // Anciennes cles repointees vers la palette terreuse (compat)
        royale: {
          blue: '#6E8C9E',
          'blue-light': '#86A2B2',
          'blue-dark': '#56707E',
          gold: '#C8902E',
          'gold-light': '#D8A94E',
          'gold-dark': '#A8761F',
          dark: '#1C1A17',
        },
      },
      fontFamily: {
        gaming: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      // Bauhaus : angles vifs. Toutes les cles rounded-* => 0.
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '0',
      },
      animation: {
        'count-up': 'countUp 1.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-gold': 'pulseSoft 2.4s ease-in-out infinite',
        'pulse-blue': 'pulseSoft 2.4s ease-in-out infinite',
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
        // Glows neon remplaces par un pulse d'opacite discret (pas de box-shadow)
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.78' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
