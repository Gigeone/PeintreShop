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
        // Palette pastel pour le site
        pastel: {
          'rose-bg': '#FFF5F5',
          'blue-bg': '#F0F4FF',
          'gray-text': '#5A5A5A',
          'lavender': '#8B7FA8',
          'rose-mauve': '#D4A5A5',
          'blue-logo': '#A8C5E2',
          'violet-logo': '#C5A8D4',
        },
      },
    },
  },
  plugins: [],
};

export default config;
