import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        butter: '#F7E7A6',
        cream: '#FFF9F0',
        blush: '#F3C6D3',
        rose: '#D99AAA',
        peach: '#F7D8C7',
        cocoa: '#3D302F',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      animation: {
        'card-lift': 'cardLift 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-in',
      },
      keyframes: {
        cardLift: {
          '0%': { transform: 'translateY(0) rotate(0deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
          '100%': { transform: 'translateY(-4px) rotate(0deg)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
