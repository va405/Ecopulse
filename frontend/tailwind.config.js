/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',      // Energetic Orange - Primary brand
        secondary: '#EF4444',    // Vibrant Red - Secondary
        accent: '#F59E0B',       // Warm Amber - Accent
        danger: '#EF4444',       // Bright Red for high emissions
        success: '#10B981',      // Keep Green for good results
        warning: '#F59E0B',      // Warm Amber
        bgDark: '#1A0F0A',       // Warm Dark Brown (was blue-dark)
        bgDarker: '#0F0807',     // Ultra dark warm (was blue-darker)
        cardDark: '#2A1810',     // Warm dark card (was blue card)
        cardLight: '#3D2418',    // Lighter warm card
        textLight: '#FFFFFF',
        textMuted: '#FFE4D6',    // Light warm tone
        orange: {
          light: '#FDBA74',
          DEFAULT: '#F97316',
          dark: '#EA580C',
        },
        red: {
          light: '#FCA5A5',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F59E0B 0%, #FDBA74 100%)',
        'gradient-analytics': 'linear-gradient(135deg, #F97316 0%, #EF4444 50%, #F59E0B 100%)',
        'gradient-carbon': 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A0F0A 0%, #0F0807 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, #F97316 0%, transparent 50%), radial-gradient(at 80% 80%, #EF4444 0%, transparent 50%), radial-gradient(at 0% 50%, #F59E0B 0%, transparent 50%)',
        'gradient-hero': 'linear-gradient(135deg, #F97316 0%, #EF4444 50%, #F59E0B 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(249, 115, 22, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
        'gradient-shine': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      },
      boxShadow: {
        'glow-orange': '0 0 30px rgba(249, 115, 22, 0.6), 0 0 60px rgba(249, 115, 22, 0.4)',
        'glow-red': '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.4)',
        'glow-amber': '0 0 30px rgba(245, 158, 11, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)',
        'glow-analytics': '0 0 40px rgba(249, 115, 22, 0.4), 0 0 80px rgba(239, 68, 68, 0.3), 0 0 120px rgba(245, 158, 11, 0.2)',
        'glow-multi': '0 0 20px rgba(249, 115, 22, 0.5), 0 0 40px rgba(239, 68, 68, 0.4), 0 0 60px rgba(245, 158, 11, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(249, 115, 22, 0.3)',
        'neon': '0 0 5px rgba(249, 115, 22, 0.6), 0 0 10px rgba(249, 115, 22, 0.5), 0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.3)',
        'fire': '0 8px 32px rgba(249, 115, 22, 0.2), 0 16px 64px rgba(239, 68, 68, 0.15)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'data-flow': 'dataFlow 3s ease-in-out infinite',
        'gradient-xy': 'gradientXY 15s ease infinite',
        'shine': 'shine 3s linear infinite',
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
        gradientXY: {
          '0%, 100%': { 
            backgroundSize: '400% 400%',
            backgroundPosition: 'left center'
          },
          '50%': { 
            backgroundSize: '200% 200%',
            backgroundPosition: 'right center'
          },
        },
        dataFlow: {
          '0%, 100%': { opacity: 0.3, transform: 'translateY(0)' },
          '50%': { opacity: 1, transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' },
        },
      },
      letterSpacing: {
        tighter: '-0.03em',
      },
    },
  },
  plugins: [],
}
