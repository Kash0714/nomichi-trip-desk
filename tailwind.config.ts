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
        rust: {
          DEFAULT: '#D55D27',
          50: '#fdf2ec',
          100: '#fae1cc',
          500: '#D55D27',
          700: '#a3411a',
        },
        yellow: {
          DEFAULT: '#FFFE00',
          50: '#ffffcc',
        },
        ink: '#1C1B1A',
        olive: {
          DEFAULT: '#45471D',
          50: '#f0f0e8',
          100: '#d9dab8',
        },
        sand: {
          DEFAULT: '#D1B788',
          50: '#faf6f0',
          100: '#f0e8d8',
        },
        cream: '#FFFBF5',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
