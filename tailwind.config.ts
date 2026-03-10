import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'red-oxide': '#9C3D32',
        'rust': '#B85C4F',
        'terracotta': '#C67B5C',
        'tan': '#D4A373',
        'beige-light': '#F5F1E8',
        'beige-medium': '#E8E0D5',
        'warm-sand': '#C6AC8E',
        'taupe': '#A68A64',
        'deep-brown': '#4A3B2C',
        'espresso': '#2C1F14',
        'sage': '#6B8E6B',
        'slate': '#5B7C8C',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'work': ['Work Sans', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },

      boxShadow: {
        'card': '0 2px 8px rgba(44, 31, 20, 0.08)',
        'card-hover': '0 4px 16px rgba(44, 31, 20, 0.12)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
