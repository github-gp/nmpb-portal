/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // NMPB-inspired palette: forest greens, earthy tones, accent gold
        forest: {
          50: '#f0f7f1',
          100: '#dcebde',
          200: '#bbd7c0',
          300: '#8fbb98',
          400: '#629b6f',
          500: '#3f7d4f',
          600: '#2d633c',
          700: '#234e30',
          800: '#1c3e27',
          900: '#163220',
        },
        earth: {
          50: '#faf7f2',
          100: '#f0e9dc',
          200: '#e2d3b8',
          300: '#d0b58c',
          400: '#b8915f',
          500: '#a07640',
          600: '#825d33',
          700: '#67492a',
          800: '#523a25',
          900: '#43301f',
        },
        gold: {
          400: '#d4af37',
          500: '#c89b1f',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(35, 78, 48, 0.08)',
        card: '0 2px 12px rgba(35, 78, 48, 0.06)',
      },
    },
  },
  plugins: [],
};