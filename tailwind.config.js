/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: '#0B3D2E',
          'emerald-light': '#125440',
          'emerald-dark': '#07271D',
          sage: '#A7C4A0',
          'sage-light': '#D6E4D3',
          'sage-dark': '#7A9F72',
          gold: '#D4AF37',
          'gold-light': '#E9C865',
          'gold-dark': '#AA891F',
          ivory: '#F8F7F1',
          'ivory-dark': '#EFECE1',
          charcoal: '#1F1F1F',
          'charcoal-light': '#4A4A4A',
          'charcoal-muted': '#717171',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(11, 61, 46, 0.12)',
        'luxury-gold': '0 8px 24px -6px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}

