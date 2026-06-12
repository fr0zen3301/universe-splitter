# Deploying to Cloudflare Pages

This app is a static Vite build plus a few serverless proxy functions (in
`functions/`) that let the quantum sources work in production without CORS
problems. Cloudflare Pages serves both from one place.

## One-time setup

1. Push this repo to GitHub (branch `main`).
2. In Cloudflare, go to Pages and connect the GitHub repo.
3. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add the ANU key (optional, only if you want the ANU quantum source active):
   - Pages project -> Settings -> Environment variables
   - Add `ANU_API_KEY` with your free key from quantumnumbers.anu.edu.au
   - Without it, ANU is simply skipped and the other sources still work.
5. Deploy. You get a `*.pages.dev` URL with HTTPS already on.

## How the proxy works

The browser only ever calls our own origin (`/qrng`, `/nist`, `/inmetro`,
`/anu`, `/curby`). In development those paths are handled by the Vite proxy
(`vite.config.js`); in production by the matching files in `functions/`. Each one
forwards the request to the real source server-side, so CORS never applies and
the ANU key stays on the server.

## Local notes

- `npm run dev` uses the Vite proxy, so quantum sources work locally.
- `npm run preview` serves the production build but has no proxy, so it will fall
  back to the non-quantum generator. That is expected locally; the deployed site
  has the functions and works fully.
