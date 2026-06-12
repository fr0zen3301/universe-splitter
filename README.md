# Universe Splitter

A quantum decision maker. You enter two options, give each a weight, and the app
pulls a genuinely random number from real quantum sources to pick one for you. It
is themed around the Everett (Many-Worlds) interpretation of quantum mechanics:
every outcome happens, the world branches, and the draw just tells you which
branch you are in.

## How it works

Each split asks several independent randomness sources at once and hashes
everything that responds into a single number (SHA-256), so the result stays
unpredictable as long as any one source is good. The number is then mapped into
the weighted range, so an option's chance is its weight divided by the total.

Sources, all reached through a same-origin proxy so the browser never makes a
cross-origin call and any API key stays server-side:

- Quantum vacuum, qrandom.io. Vacuum fluctuations measured on quantum hardware. Keyless. [QUANTUM]
- ANU, quantumnumbers.anu.edu.au. Vacuum-fluctuation quantum generator. Needs a free key. [QUANTUM]
- NIST beacon, beacon.nist.gov. Independent, cryptographically signed randomness pulses.
- INMETRO beacon, beacon.inmetro.gov.br. Brazil's signed randomness beacon.

If not one source can be reached, the app falls back to the device's own secure
generator (crypto.getRandomValues) and labels that result "not quantum," so you
always know exactly what produced your answer.

## Tech

- React 19 + Vite
- Tailwind CSS v3
- Custom "Frozen" pixel font and a canvas glitch title
- Cloudflare Pages + Pages Functions for hosting and the production proxy

## Project structure

- `src/App.jsx` - main UI, inputs, scramble animation, result
- `src/components/calculation.js` - the quantum randomness sourcing and combine logic
- `src/components/InfoModal.jsx` - the More Info popup (How it works + Privacy Policy)
- `src/components/` - FuzzyText, OptionInput, WeightInput, InfoButton
- `src/GlitchEffect.css`, `src/index.css` - box, background, and animation styles
- `functions/` - Cloudflare Pages proxy functions (production)
- `vite.config.js` - dev server proxy (mirrors the functions in development)

## Running locally

```
npm install
npm run dev
```

`npm run dev` runs the Vite dev server with the proxy, so the quantum sources
work locally. Open the URL it prints.

Note: `npm run preview` serves the production build but has no proxy, so it falls
back to the non-quantum generator. That is only a local quirk. The deployed site
has the proxy functions and works fully.

## Privacy

Nothing you type leaves your browser. The only network requests fetch random
numbers from the sources above and carry no personal information. No analytics,
no cookies, no storage. See the Privacy Policy tab in the app's More Info popup.
