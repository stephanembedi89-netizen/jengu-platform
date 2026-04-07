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
        /* Backgrounds */
        navy: {
          deep:   '#06090f',
          mid:    '#0d1421',
          card:   '#111b2e',
          border: '#162035',
        },
        /* Brand */
        blue: {
          electric: '#2d7ff9',
          glow:     '#5b9fff',
          muted:    '#1a3a6b',
          dim:      'rgba(45,127,249,0.12)',
        },
        gold: {
          DEFAULT: '#f5a623',
          soft:    'rgba(245,166,35,0.12)',
          light:   '#fbbf24',
        },
        /* Text */
        text: {
          primary:   '#f0f4ff',
          secondary: '#8a9bbf',
          muted:     '#3d5070',
        },
        /* Semantic */
        success: {
          DEFAULT: '#22c55e',
          bg:      'rgba(34,197,94,0.08)',
        },
        danger: {
          DEFAULT: '#f43f5e',
          bg:      'rgba(244,63,94,0.08)',
        },
        warning: '#f5a623',
      },
      fontFamily: {
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card:  '20px',
        input: '12px',
        btn:   '12px',
        pill:  '999px',
      },
      boxShadow: {
        xs:         '0 1px 3px rgba(0,0,0,0.4)',
        card:       '0 2px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover':'0 12px 40px rgba(45,127,249,0.14), 0 0 0 1px rgba(45,127,249,0.18)',
        btn:        '0 4px 20px rgba(45,127,249,0.35)',
        'btn-hover':'0 8px 32px rgba(45,127,249,0.50)',
        glow:       '0 0 0 3px rgba(45,127,249,0.18)',
        blue:       '0 4px 24px rgba(45,127,249,0.30)',
        gold:       '0 4px 24px rgba(245,166,35,0.25)',
        inset:      'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34,1.56,0.64,1)',
        smooth: 'cubic-bezier(0.4,0,0.2,1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      animation: {
        'pulse-gold': 'pulse_gold 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':    'fadeIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-up':   'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        typing:       'typing 1.2s infinite',
        shimmer:      'shimmer 2s infinite',
      },
      keyframes: {
        pulse_gold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,166,35,0.35)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(245,166,35,0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%':           { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
    },
  },
  plugins: [],
};

export default config;
