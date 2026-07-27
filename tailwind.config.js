const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      /* gom: align radii with the Green0meter platform (MUI shape.borderRadius: 10).
         Remapping the scale restyles every rounded-md/lg use without touching DOM. */
      borderRadius: {
        DEFAULT: '0.375rem',
        md: '0.625rem',
        lg: '0.75rem',
      },
      /* gom: soften the elevation scale to the platform's near-flat look */
      boxShadow: {
        sm: '0 1px 2px rgba(16, 24, 39, 0.05), 0 4px 12px rgba(16, 24, 39, 0.04)',
        DEFAULT:
          '0 1px 2px rgba(16, 24, 39, 0.06), 0 6px 16px rgba(16, 24, 39, 0.06)',
      },
      colors: {
        ninja: {
          gray: '#242930',
          'gray-darker': '#2F2E2E',
          'gray-lighter': '#363D47',
        },
        /* gom: Green0meter platform tokens (green0meter-app/src/theme) */
        gom: {
          primary: '#26794C',
          'primary-dark': '#195A37',
          'primary-tint': '#E6F5ED',
          surface: '#F5F5F5',
          ink: '#101827',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography'),
  ],
};
