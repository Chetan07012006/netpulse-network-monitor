/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          cardHover: '#24344D',
          border: '#334155',
          header: '#0B1120',
          subtle: '#64748B'
        },
        net: {
          cyan: '#00BFFF',
          cyanGlow: 'rgba(0, 191, 255, 0.25)',
          green: '#2ECC71',
          greenGlow: 'rgba(46, 204, 113, 0.25)',
          orange: '#F39C12',
          orangeGlow: 'rgba(243, 156, 18, 0.25)',
          red: '#EF4444',
          redGlow: 'rgba(239, 68, 68, 0.25)',
          blue: '#38BDF8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: [],
}
