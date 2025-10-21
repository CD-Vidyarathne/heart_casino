import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx,html}',
    './src/renderer/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
          light: '#a78bfa',
        },
        secondary: '#ec4899',
        accent: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        'bg-primary': '#1f1b2e',
        'bg-secondary': '#2d1b69',
        'bg-glass': 'rgba(139, 92, 246, 0.1)',
        'bg-glass-hover': 'rgba(139, 92, 246, 0.2)',
        'text-primary': '#ffffff',
        'text-secondary': '#e5e7eb',
        'text-muted': '#9ca3af',
        border: 'rgba(139, 92, 246, 0.3)',
        'border-focus': 'rgba(139, 92, 246, 0.6)',
      },
      fontFamily: {
        'rubik-puddles': ['Rubik Puddles', 'system-ui'],
        'luckiest-guy': ['Luckiest Guy', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
} satisfies Config
