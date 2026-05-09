/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fbbf24', // yellow for rating stars and accents
        secondary: '#10b981', // emerald for success states
        destructive: '#ef4444', // red for errors
        muted: '#e5e7eb', // neutral gray for backgrounds
        background: '#ffffff', // light background (will be overridden by dark mode)
        foreground: '#000000', // text color
      },
      borderRadius: {
        DEFAULT: '0.75rem', // rounded-xl
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
