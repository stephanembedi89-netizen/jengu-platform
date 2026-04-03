import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#04080f',
          mid: '#080e1c',
          card: '#0c1527',
          border: '#111e35',
        },
        blue: {
          electric: '#1a7fff',
          glow: '#4da6ff',
          muted: '#1a3a6b',
        },
        gold: {
          DEFAULT: '#f0a500',
          soft: 'rgba(240,165,0,0.13)',
          light: '#fbbf24',
        },
        text: {
          primary: '#eef2ff',
          secondary: '#7d94b5',
          muted: '#3d5473',
        },
        success: {
          DEFAULT: '#10b981',
          bg: 'rgba(16,185,129,0.07)',
        },
        danger: {
          DEFAULT: '#ef4444',
          bg: 'rgba(239,68,68,0.07)',
        },
        warning: '#f0a500',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        btn: '12px',
        pill: '24px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover': '0 16px 48px rgba(26,127,255,0.14)',
        btn: '0 4px 20px rgba(26,127,255,0.35)',
        glow: '0 0 0 3px rgba(26,127,255,0.15)',
      },
      animation: {
        pulse_gold: 'pulse_gold 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in': 'fadeIn 0.38s ease-out forwards',
        typing: 'typing 1.2s infinite',
      },
      keyframes: {
        pulse_gold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(240,165,0,0.35)' },
          '50%': { boxShadow: '0 0 0 8px rgba(240,165,0,0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
