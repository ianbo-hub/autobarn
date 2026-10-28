import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:   '#FAF7F2',
        'off-white': '#EBEBEB',
        ink:     '#111111',
        red:     { DEFAULT: '#E61919', dark: '#B01212' },
        grey:    { 100: '#F0EFEB', 200: '#E0DFDB', 400: '#9A9A9A', 600: '#555555' },
        rule:    '#CCCCCC',
        green:   '#1A8A4A',
        amber:   '#D4820A',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        serif:   ['var(--font-cormorant-garant)', 'Georgia', 'serif'],
        sans:    ['var(--font-dm-sans)', 'Helvetica Neue', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'Courier New', 'monospace'],
      },
      maxWidth: { content: '1280px' },
      screens: {
        xs: '400px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

export default config
