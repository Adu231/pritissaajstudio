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
          // --- Official Deep Forest Green & Champagne Gold System ---
          forest: '#0B3B24',            // Deep Forest Green — Primary brand colour
          'forest-dark': '#072718',     // Slightly darker forest green for hover/active
          'forest-light': '#134E32',    // Slightly lighter forest green

          champagne: '#E3CBA9',         // Champagne Gold — Main luxury accent
          'champagne-dark': '#C5A87F',  // Deeper champagne gold for high contrast on light bg
          'champagne-light': '#F4EBDD', // Delicate soft champagne tint

          white: '#FFFFFF',             // Pure White — Main background
          offwhite: '#FCFEFF',          // Soft Champagne / Off-white — Secondary light background

          dark: '#252525',              // Dark Text — Primary text
          muted: '#777777',             // Muted Text — Secondary text
          border: '#E8E4DC',            // Light Border — Borders and dividers
          'border-light': '#F2EFE9',    // Subtle divider line

          // --- Comprehensive Design Token Aliases (Complete Theme Migration) ---
          emerald: '#0B3B24',           // Deep Forest Green
          'emerald-light': '#134E32',   // Forest Green Light
          'emerald-dark': '#072718',    // Forest Green Dark (Hover)
          sage: '#E3CBA9',              // Champagne Gold Accent
          'sage-light': '#E8E4DC',      // Light Border
          'sage-dark': '#C5A87F',       // Champagne Gold Dark
          gold: '#E3CBA9',              // Champagne Gold Accent
          'gold-light': '#F4EBDD',      // Soft Champagne Light
          'gold-dark': '#C5A87F',       // Champagne Gold Deep
          ivory: '#FCFEFF',             // Soft Champagne / Off-white
          'ivory-dark': '#E8E4DC',      // Light Border
          charcoal: '#252525',          // Dark Text
          'charcoal-light': '#555555',  // Medium Dark Text
          'charcoal-muted': '#777777',  // Muted Secondary Text
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(11, 59, 36, 0.09)',
        'luxury-gold': '0 8px 24px -6px rgba(227, 203, 169, 0.4)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
