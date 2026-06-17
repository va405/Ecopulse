/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D9FF',      // Cyan - Primary brand
        secondary: '#FF00FF',    // Magenta - Secondary
        accent: '#FFD700',       // Gold - Accent
        danger: '#FF3366',       // Pink-Red for high emissions
        success: '#00FF88',      // Neon Green for good results
        warning: '#FFAA00',      // Orange-Amber
        bgDark: '#0A0118',       // Deep purple-black
        bgDarker: '#050010',     // Ultra dark purple
        cardDark: '#1A0B2E',     // Purple card background
        cardLight: '#2D1B4E',    // Lighter purple card
        textLight: '#FFFFFF',
        textMuted: '#B794F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00D9FF 0%, #0099CC 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FF00FF 0%, #CC00CC 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-analytics': 'linear-gradient(135deg, #00D9FF 0%, #FF00FF 50%, #FFD700 100%)',
        'gradient-carbon': 'linear-gradient(135deg, #0099CC 0%, #FF00FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0118 0%, #050010 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, #00D9FF 0%, transparent 50%), radial-gradient(at 80% 80%, #FF00FF 0%, transparent 50%), radial-gradient(at 0% 50%, #FFD700 0%, transparent 50%)',
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(0, 217, 255, 0.5), 0 0 60px rgba(0, 217, 255, 0.3)',
        'glow-purple': '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3)',
        'glow-orange': '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
        'glow-analytics': '0 0 40px rgba(0, 217, 255, 0.3), 0 0 80px rgba(255, 0, 255, 0.2), 0 0 120px rgba(255, 215, 0, 0.1)',
        'glow-multi': '0 0 20px rgba(0, 217, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.3), 0 0 60px rgba(255, 215, 0, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(0, 217, 255, 0.2)',
        'neon': '0 0 5px rgba(0, 217, 255, 0.5), 0 0 10px rgba(0, 217, 255, 0.4), 0 0 20px rgba(0, 217, 255, 0.3), 0 0 40px rgba(255, 0, 255, 0.2)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'data-flow': 'dataFlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        dataFlow: {
          '0%, 100%': { opacity: 0.3, transform: 'translateY(0)' },
          '50%': { opacity: 1, transform: 'translateY(-10px)' },
        },
      },
      letterSpacing: {
        tighter: '-0.03em',
      },
    },
  },
  plugins: [],
}
