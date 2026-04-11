/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          card: 'var(--bg-card)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          dim: 'var(--ink-dim)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          bright: 'var(--gold-bright)',
          dim: 'var(--gold-dim)',
        },
        plum: 'var(--plum)',
        negative: 'var(--negative)',
        warning: 'var(--warning)',
        info: 'var(--info)',
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
        lift: 'var(--shadow-lift)',
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
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
