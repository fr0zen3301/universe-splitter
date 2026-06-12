import React, { useState, useRef, useEffect } from "react";
import '../src/GlitchEffect.css'
import FuzzyText from './components/FuzzyText';
import OptionInput from "./components/OptionInput";
import InfoButton from "./components/InfoButton";
import EditableOption from "./components/EditableOption";
import WeightInput from "./components/WeightInput";
import InfoModal from "./components/InfoModal";
import { splitUniverse } from "./components/calculation";

// glitch glyphs used by the scramble animation
const GLYPHS = "01ψΔΣ|/\\<>=+*xλφ";
function randGlyphs(len) {
  let s = "";
  for (let i = 0; i < len; i++) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return s;
}

const App = () => {
  const [option1, setOption1] = useState("Take a chance");
  const [option2, setOption2] = useState("Do not take a chance");

  const [weight1, setWeight1] = useState(1);
  const [weight2, setWeight2] = useState(1);

  const [showInfo, setShowInfo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scramble, setScramble] = useState("");
  const [glitch, setGlitch] = useState(false);
  const [result, setResult] = useState(null);

  const handleSplit = async () => {
    if (busy) return;
    setBusy(true);
    setResult(null);

    try {
      // run the calculation, but keep the animation up for a beat of suspense
      const [r] = await Promise.all([
        splitUniverse(weight1, weight2),
        new Promise((res) => setTimeout(res, 1700)),
      ]);
      setResult(r);
    } finally {
      setBusy(false);
    }
  };

  // Scramble animation: while measuring, rapidly flip between the two options
  // and quantum glyph noise, slowing down over time — until the result locks in.
  useEffect(() => {
    if (!busy) return;
    const opts = [option1 || "Option A", option2 || "Option B"];
    let alive = true;
    let timer;
    const start = performance.now();
    const tick = () => {
      if (!alive) return;
      const elapsed = performance.now() - start;
      if (Math.random() < 0.55) {
        setScramble(opts[Math.floor(Math.random() * opts.length)]);
        setGlitch(false);
      } else {
        setScramble(randGlyphs(6 + Math.floor(Math.random() * 8)));
        setGlitch(true);
      }
      const delay = 45 + Math.min(elapsed / 2000, 1) * 150; // slow down
      timer = setTimeout(tick, delay);
    };
    tick();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [busy, option1, option2]);

  return (<>
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
      <div id="bg" className="absolute inset-0 z-0"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="glitch-box relative">
          {/* Main box */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full pt-[25px]">
            <div className="font-frozen text-5xl text-white p-[px]">
              <FuzzyText
                fontSize="3.3rem"
                baseIntensity={0.15}
                hoverIntensity={0.25}
                enableHover={true}
              >
                ψ(x)
                UNIVERSE SPLITTER
              </FuzzyText>
            </div>

            {/* Body box */}
            <div className="glitch-box relative flex flex-col">
              {/* Inputs — each option lines up with its own weight */}
              <div className="px-[25px] pt-[28px] text-white font-frozen">
                <p className="text-base text-white/60 leading-relaxed mb-6">
                  Enter two alternatives below. The universe will split. Which one you
                  find yourself in is random, weighted by the numbers you set.
                </p>
                <div className="flex flex-row items-end gap-6 mb-3">
                  <div className="flex-1"></div>
                  <div className="w-[70px] text-center text-2xl">Weight</div>
                </div>

                <div className="flex flex-row items-end gap-6 mb-6 text-3xl">
                  <div className="flex-1 min-w-0">
                    <OptionInput
                      value={option1}
                      onChange={(e) => setOption1(e.target.value)}
                      placeholder="Take a chance"
                    />
                  </div>
                  <div className="w-[70px] text-2xl">
                    <WeightInput value={weight1} onChange={setWeight1} />
                  </div>
                </div>

                <div className="flex flex-row items-end gap-6 text-3xl">
                  <div className="flex-1 min-w-0">
                    <OptionInput
                      value={option2}
                      onChange={(e) => setOption2(e.target.value)}
                      placeholder="Do not take a chance"
                    />
                  </div>
                  <div className="w-[70px] text-2xl">
                    <WeightInput value={weight2} onChange={setWeight2} />
                  </div>
                </div>
              </div>

              {/* Middle — measurement animation, then the result */}
              <div className="flex-1 flex items-center justify-center text-center px-[20px] text-white font-frozen">
                {busy ? (
                  <div>
                    <div className="text-xl text-white/60 mb-3 tracking-[0.15em]">
                      collapsing the wavefunction
                    </div>
                    <div className={`text-4xl break-words ${glitch ? "q-glitch" : ""}`}>
                      {scramble || "\u00A0"}
                    </div>
                  </div>
                ) : result ? (
                  <div className="q-rise leading-snug">
                    <div className="text-xl text-white/60 mb-1">the universe chose</div>
                    <div className="text-4xl break-words q-pop">
                      {result.winner === 1 ? option1 : option2}
                    </div>
                    <div className="mt-3 text-base text-white/50">
                      drew {result.draw} / {result.total} · {result.source}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* SPLIT button at the bottom of the box */}
              <div className="font-frozen text-white p-[10px] flex justify-center">
                <button
                  onClick={handleSplit}
                  disabled={busy}
                  className="border-2 border-white/70 px-12 py-3 text-2xl tracking-wide hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                >
                  {busy ? "SPLITTING..." : "SPLIT THE UNIVERSE"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* More Info — below the box, outside it */}
        <div className="font-frozen text-white mt-6 flex justify-center">
          <InfoButton onClick={() => setShowInfo(true)} />
        </div>
      </div>
    </div>

    <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
  </>)
}

export default App;
