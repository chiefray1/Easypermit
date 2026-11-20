/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#102B4D',
          50: '#F1F5FA',
          100: '#E2EAF4',
          200: '#C5D5E9',
          300: '#9FB7D4',
          400: '#6C8DB5',
          500: '#3F6592',
          600: '#274D77',
          700: '#183A5F',
          800: '#102B4D',
          900: '#0C2340',
          950: '#091B30',
        },
        gold: {
          DEFAULT: '#C49A48',
          50: '#FDF9F0',
          100: '#F8EFD8',
          200: '#F0DDB1',
          300: '#E5C685',
          400: '#D6AE5F',
          500: '#C49A48',
          600: '#A87F36',
          700: '#86632B',
          800: '#684D24',
          900: '#553F20',
        },
        mist: '#F5F7FA',
        body: '#344054',
        success: '#16845B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,43,77,0.04), 0 12px 32px -18px rgba(16,43,77,0.22)',
        lift: '0 18px 48px -20px rgba(16,43,77,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
