/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0a0f',
          surface: '#141420',
          elevated: '#1c1c2a',
          card: '#22222f',
        },
        ink: {
          DEFAULT: '#f5f0e8',
          muted: '#a8a39a',
          dim: '#6e6a63',
        },
        gold: {
          DEFAULT: '#f0a500',
          bright: '#ffb733',
          dim: '#b87f00',
        },
        plum: '#3a2a4a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        ui: ['"DM Sans"', 'system-ui', 'sans-serif'],
        story: ['"Lora"', 'Georgia', 'serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        lift: '0 8px 24px rgba(0,0,0,0.5)',
        card: '0 8px 8px rgba(0,0,0,0.3)',
        glow: '0 0 32px rgba(240, 165, 0, 0.25)',
      },
      keyframes: {
        twinkle: {
          '0%,100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        floatUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        twinkle: 'twinkle 4s ease-in-out infinite',
        floatUp: 'floatUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
