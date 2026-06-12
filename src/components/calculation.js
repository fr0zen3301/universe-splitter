// calculation.js
// -----------------------------------------------------------------------------
// QUANTUM-FIRST decision logic for the Universe Splitter.
//
// Rather than trusting a single provider, we query several independent quantum /
// signed-beacon randomness sources IN PARALLEL and hash everything that responds
// into one number with SHA-256. The output is unpredictable as long as ANY single
// source is good — that's what "combine to maximize entropy and reliability" means.
//
// Sources are routed through a same-origin proxy so CORS can't block them and
// keys stay server-side: the Vite proxy in dev (vite.config.js), and Cloudflare
// Pages Functions in production (functions/).
//   * quantum vacuum  - qrandom.io            (vacuum fluctuations; keyless)  [QUANTUM]
//   * ANU             - quantumnumbers.anu...  (vacuum; needs free API key)   [QUANTUM]
//   * NIST beacon     - beacon.nist.gov        (signed gov beacon; keyless)
//   * INMETRO beacon  - beacon.inmetro.gov.br  (signed beacon; keyless)
//
// If NOT ONE source answers, we DO NOT fake it: we use the device's own secure
// generator and label the result "not quantum" so you always know what you got.
//
// NOTE: endpoints for the beacons follow the standard Interoperable Beacon 2.0
// format; verify them live when possible. Any source that errors is skipped
// gracefully, so a wrong/unavailable endpoint never breaks the app.
// -----------------------------------------------------------------------------

const TIMEOUT_MS = 3500;

// Same-origin proxy paths. In dev these are served by the Vite proxy
// (vite.config.js); in production by Cloudflare Pages Functions (functions/).
// Either way the browser only talks to our own origin, so CORS never applies.
const BASE = {
  qrng: "/qrng",
  nist: "/nist",
  inmetro: "/inmetro",
  anu: "/anu",
};

// fetch with an abort-based timeout so one slow source can't hold up the mix.
async function timedFetch(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("bad status " + res.status);
    return res;
  } finally {
    clearTimeout(t);
  }
}

// --- individual sources: each returns { contribution, source, quantum } -------

// qrandom.io — real quantum (vacuum fluctuations). Fresh per request.
async function srcQuantumVacuum() {
  const res = await timedFetch(`${BASE.qrng}/api/random/int?min=0&max=2147483647`);
  const d = await res.json();
  const n = d.number ?? d.value;
  if (typeof n !== "number") throw new Error("unexpected shape");
  return { contribution: "qv:" + n, source: "quantum vacuum", quantum: true };
}

// ANU Quantum Numbers — real quantum (vacuum). Only works once ANU_API_KEY is set.
async function srcAnu() {
  const res = await timedFetch(`${BASE.anu}/?length=4&type=uint16`);
  const d = await res.json();
  if (!d || d.success !== true || !Array.isArray(d.data)) throw new Error("unexpected shape");
  return { contribution: "anu:" + d.data.join(","), source: "ANU quantum", quantum: true };
}

// NIST randomness beacon — latest signed pulse (512-bit outputValue, hex).
async function srcNistBeacon() {
  const res = await timedFetch(`${BASE.nist}/beacon/2.0/pulse/last`);
  const d = await res.json();
  const hex = d && d.pulse && d.pulse.outputValue;
  if (!hex) throw new Error("unexpected shape");
  return { contribution: "nist:" + hex, source: "NIST beacon", quantum: false };
}

// Brazilian INMETRO beacon — same Interoperable 2.0 pulse format.
async function srcInmetroBeacon() {
  const res = await timedFetch(`${BASE.inmetro}/beacon/2.0/pulse/last`);
  const d = await res.json();
  const hex = d && d.pulse && d.pulse.outputValue;
  if (!hex) throw new Error("unexpected shape");
  return { contribution: "inmetro:" + hex, source: "INMETRO beacon", quantum: false };
}

const SOURCES = [srcQuantumVacuum, srcAnu, srcNistBeacon, srcInmetroBeacon];

// SHA-256 a string and fold the first 48 bits into a safe integer.
async function digestToInt(str) {
  const bytes = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  const view = new DataView(buf);
  return view.getUint32(0) * 65536 + view.getUint16(4); // up to 2^48
}

// Query every source in parallel; mix all that respond into one integer.
// Returns { value, names, quantum } or null if nothing answered.
export async function getCombinedRandom() {
  const settled = await Promise.allSettled(SOURCES.map((s) => s()));
  const ok = settled
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);

  if (ok.length === 0) return null;

  const combined = ok.map((o) => o.contribution).join("|");
  const value = await digestToInt(combined);
  return {
    value,
    names: ok.map((o) => o.source),
    quantum: ok.some((o) => o.quantum),
  };
}

// Run one split. Maps the combined integer into the weighted range [1, total].
//   winner: 1 -> option 1, 2 -> option 2
export async function splitUniverse(weight1, weight2) {
  const w1 = Math.max(0, Number(weight1) || 0);
  const w2 = Math.max(0, Number(weight2) || 0);
  const total = w1 + w2;

  if (total <= 0) {
    return { winner: 1, draw: 1, total: 1, source: "n/a", sources: [], quantum: false, p1: 50, p2: 50 };
  }

  let value, source, names, quantum;

  const combined = await getCombinedRandom();
  if (combined) {
    value = combined.value;
    names = combined.names;
    quantum = combined.quantum;
    source =
      names.length === 1 ? names[0]
      : names.length <= 2 ? names.join(" + ")
      : `${names.length} sources mixed`;
  } else {
    // Nothing reachable — be honest, this is NOT quantum.
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    value = buf[0];
    names = [];
    quantum = false;
    source = "hardware RNG (not quantum)";
  }

  const draw = (value % total) + 1;          // uniform-ish integer in [1, total]
  const winner = draw <= w1 ? 1 : 2;
  const p1 = Math.round((w1 / total) * 100);

  return { winner, draw, total, source, sources: names, quantum, p1, p2: 100 - p1 };
}

export default splitUniverse;
