import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // All randomness sources are proxied through localhost so the browser's
    // CORS policy never applies, and so API keys stay server-side (never shipped
    // to the browser).
    proxy: {
      // qrandom.io — real quantum (vacuum fluctuations). Keyless.
      '/qrng': {
        target: 'https://qrandom.io',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/qrng/, ''),
      },
      // NIST randomness beacon — signed government beacon (Interoperable 2.0). Keyless.
      '/nist': {
        target: 'https://beacon.nist.gov',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/nist/, ''),
      },
      // Brazilian INMETRO beacon — signed beacon (Interoperable 2.0). Keyless.
      '/inmetro': {
        target: 'https://beacon.inmetro.gov.br',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/inmetro/, ''),
      },
      // ANU Quantum Numbers — real quantum (vacuum). Needs a free API key:
      // set ANU_API_KEY in your shell before `npm run dev` and it's injected here.
      // Without a key this source simply 401s and is skipped — nothing breaks.
      '/anu': {
        target: 'https://api.quantumnumbers.anu.edu.au',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/anu/, ''),
        headers: process.env.ANU_API_KEY ? { 'x-api-key': process.env.ANU_API_KEY } : {},
      },
      // CU Boulder / NIST Bell-test quantum beacon (keyless; quantum stream
      // currently offline for upgrades — wired for when it returns).
      '/curby': {
        target: 'https://random.colorado.edu',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/curby/, ''),
      },
    },
  },
})
