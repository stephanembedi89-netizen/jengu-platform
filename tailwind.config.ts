import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'jengu': {
          bg:       '#020617',   // Slate 950
          navy:     '#0a0e27',
          card:     'rgba(13,27,75,0.45)',
          blue:     '#3b82f6',   // Electric blue
          cyan:     '#06b6d4',
          amber:    '#fbbf24',   // Gold CTA
          'amber-dark': '#d97706',
          border:   'rgba(59,130,246,0.2)',
          text:     '#cbd5e1',
          muted:    '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.25) 0%, transparent 70%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(6,182,212,0.04) 100%)',
      },
      boxShadow: {
        'glass':  '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
        'blue-glow': '0 0 40px rgba(59,130,246,0.35)',
        'amber-glow': '0 0 30px rgba(251,191,36,0.4)',
        'neon': '0 0 15px rgba(59,130,246,0.6), 0 0 40px rgba(59,130,246,0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'wave': 'wave 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.05)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
