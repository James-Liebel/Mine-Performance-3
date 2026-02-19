import type { Config } from 'tailwindcss';

/** Custom palette: warm, energetic, distinct from generic orange. */
const colors = {
  brand: {
    DEFAULT: 'hsl(var(--brand) / <alpha-value>)',
    50: 'hsl(var(--brand-50) / <alpha-value>)',
    100: 'hsl(var(--brand-100) / <alpha-value>)',
    200: 'hsl(var(--brand-200) / <alpha-value>)',
    300: 'hsl(var(--brand-300) / <alpha-value>)',
    400: 'hsl(var(--brand-400) / <alpha-value>)',
    500: 'hsl(var(--brand-500) / <alpha-value>)',
    600: 'hsl(var(--brand-600) / <alpha-value>)',
    700: 'hsl(var(--brand-700) / <alpha-value>)',
    800: 'hsl(var(--brand-800) / <alpha-value>)',
    900: 'hsl(var(--brand-900) / <alpha-value>)',
  },
  surface: {
    DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
    muted: 'hsl(var(--surface-muted) / <alpha-value>)',
  },
  ink: {
    DEFAULT: 'hsl(var(--ink) / <alpha-value>)',
    muted: 'hsl(var(--ink-muted) / <alpha-value>)',
  },
};

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'card': '0.75rem',
        'pill': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
