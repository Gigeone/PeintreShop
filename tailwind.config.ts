import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-instrument-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      colors: {
        // Palette "mur de galerie" : neutres chauds, les toiles apportent la couleur
        paper: '#F4EFE6', // fond principal
        surface: '#FBF8F2', // sections alternées, passe-partout
        wall: '#ECE5D8', // fond derrière les toiles
        ink: '#1D1B26', // texte principal, boutons
        body: '#4A4654', // paragraphes
        muted: '#5C5767', // légendes, métadonnées
        line: '#DDD5C6', // séparateurs
        'line-strong': '#CFC6B5', // bordures de champs
        accent: '#2A3A8F', // bleu outremer tiré des toiles
        success: '#2F7A4F',
      },
      boxShadow: {
        painting:
          '0 1px 2px rgba(29,27,38,0.12), 0 18px 36px -18px rgba(29,27,38,0.45)',
        'painting-lg':
          '0 1px 2px rgba(29,27,38,0.10), 0 30px 60px -30px rgba(29,27,38,0.45)',
      },
      letterSpacing: {
        eyebrow: '0.14em',
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
