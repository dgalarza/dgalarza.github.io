/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './themes/*/layouts/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e1a',
          surface: '#1a1f2e',
        },
        accent: {
          teal: '#20D0BC',
          purple: '#9333ea',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
}