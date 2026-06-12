import React, { useEffect, useRef } from "react";

/**
 * WaveBackground
 * -----------------------------------------------------------------------------
 * A live quantum interference field. We superpose several plane waves and
 * color-map the resulting probability density |ψ|² = Re² + Im². The waves'
 * phases advance and their k-vectors slowly rotate, so the interference fringes
 * drift and morph without ever cleanly repeating — the feeling of standing
 * inside an evolving wavefunction.
 *
 * Performance: the field is computed into a tiny offscreen buffer (a few
 * thousand pixels) and the browser scales it up; a CSS blur turns that into a
 * soft probability cloud. The frame rate is capped, the loop pauses when the
 * tab is hidden, and prefers-reduced-motion gets a single static frame.
 * -----------------------------------------------------------------------------
 */
const WaveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Tiny internal buffer — we render small and let CSS + blur scale it up.
    const MAX_PIXELS = 14000;
    let W = 1, H = 1, img = null;
    let raf = 0, last = 0, t = 0;

    const resize = () => {
      const aspect = window.innerWidth / Math.max(1, window.innerHeight);
      H = Math.max(1, Math.round(Math.sqrt(MAX_PIXELS / aspect)));
      W = Math.max(1, Math.round(H * aspect));
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);
    };

    // Four plane waves. Each slowly rotates its travel direction (spin) and
    // advances its phase in time (w), so the interference keeps reshaping.
    const waves = [
      { k: 5.0, dir: 0.4, spin: 0.013, w: 0.55, phase: 0.0 },
      { k: 6.3, dir: 2.1, spin: -0.009, w: 0.80, phase: 1.7 },
      { k: 4.1, dir: 3.7, spin: 0.017, w: 1.05, phase: 3.1 },
      { k: 7.0, dir: 5.2, spin: -0.012, w: 0.70, phase: 5.0 },
    ];
    const N = waves.length;
    const kx = new Float32Array(N);
    const ky = new Float32Array(N);
    const wt = new Float32Array(N);

    const draw = () => {
      for (let i = 0; i < N; i++) {
        const wv = waves[i];
        const ang = wv.dir + wv.spin * t;
        kx[i] = Math.cos(ang) * wv.k;
        ky[i] = Math.sin(ang) * wv.k;
        wt[i] = wv.w * t + wv.phase;
      }
      // a slow global "breathing" so the whole field swells and settles
      const breathe = 0.82 + 0.18 * Math.sin(t * 0.16);

      const data = img.data;
      for (let y = 0; y < H; y++) {
        const ny = y / H;
        const cy = ny - 0.5;
        for (let x = 0; x < W; x++) {
          const nx = x / W;
          const cx = nx - 0.5;
          let re = 0, im = 0;
          for (let i = 0; i < N; i++) {
            const ph = kx[i] * nx + ky[i] * ny + wt[i];
            re += Math.cos(ph);
            im += Math.sin(ph);
          }
          // |ψ|² normalised to 0..1, then sharpened so the fringes read clearly
          let d = (re * re + im * im) / (N * N);
          d = d * d * breathe;

          // radial vignette: a dark-navy core that fades to near-black at the
          // rim, just like the original gradient — keeps the whole field dark.
          const vig = 1 - Math.min(1, (cx * cx + cy * cy) * 1.3);

          const idx = (y * W + x) << 2;
          // deep navy vacuum -> a muted DARK BLUE at the antinodes (never electric)
          data[idx] = vig * (7 + d * 24);       // R
          data[idx + 1] = vig * (11 + d * 40);  // G
          data[idx + 2] = vig * (27 + d * 80);  // B
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps is plenty for a soft, blurred field
      last = now;
      t += 0.02;
      draw();
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) {
      draw(); // honour reduced-motion: one still frame, no animation
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0"
      style={{
        width: "100vw",
        height: "100dvh",
        // upscaling a tiny buffer + blur = a soft, dreamy probability cloud
        filter: "blur(16px) saturate(1.1)",
        transform: "scale(1.1)", // bleed the blurred edges off-screen
        pointerEvents: "none",
      }}
    />
  );
};

export default WaveBackground;
