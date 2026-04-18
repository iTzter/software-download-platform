import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './actions/**/*.{ts,tsx}'
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        muted: '#18181b',
        border: '#27272a'
      }
    }
  },
  plugins: []
};

export default config;
