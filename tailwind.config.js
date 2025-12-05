/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // New Purple/Violet Base for Repix
        repix: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Accent Colors for the Gradient Theme
        accent: {
          pink: '#ec4899',
          blue: '#3b82f6'
        },
        dark: {
          bg: '#09090b',
          surface: '#18181b',
          border: '#27272a'
        },
        light: {
          bg: '#ffffff',
          surface: '#f4f4f5',
          border: '#e4e4e7'
        }
      },
      animation: {
        'scroll': 'scroll 30s linear infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      }
    }
  },
  plugins: [],
}
