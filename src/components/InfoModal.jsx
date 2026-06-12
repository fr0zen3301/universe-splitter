import React, { useState, useRef, useEffect } from "react";

// Info popup shown when "More Info" is pressed. Uses the same Frozen font and
// white-on-dark styling as the rest of the page. Two tabs at the top:
// "How it works" (the FAQ) and "Privacy Policy".
const InfoModal = ({ open, onClose }) => {
  const [tab, setTab] = useState("about");
  const scrollRef = useRef(null);

  // jump back to the top whenever the tab changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab]);

  if (!open) return null;

  const linkClass =
    "underline decoration-white/40 hover:decoration-white text-white";

  // Replace with your real repository URL to make the Open Source link work.
  const REPO_URL = "https://github.com/fr0zen3301";

  const tabClass = (name) =>
    tab === name
      ? "text-white underline decoration-white/60"
      : "text-white/50 hover:text-white";

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-frozen"
    >
      <div
        ref={scrollRef}
        className="relative w-full max-w-[660px] max-h-[85vh] overflow-auto border-2 border-white bg-[#02030A] text-white p-6"
      >
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute top-2 right-4 text-3xl leading-none text-white/70 hover:text-white"
        >
          ×
        </button>

        {/* Top navigation */}
        <nav className="flex items-center gap-3 text-base mb-6 pr-8">
          <button onClick={() => setTab("about")} className={tabClass("about")}>
            How it works
          </button>
          <span className="text-white/25">|</span>
          <button onClick={() => setTab("privacy")} className={tabClass("privacy")}>
            Privacy Policy
          </button>
        </nav>

        {tab === "about" ? (
          <div className="space-y-6 text-xl leading-relaxed text-white/85">
            <section>
              <p className="text-2xl text-white mb-2">How does it work?</p>
              <p>
                You type in two options and give each a weight. When you split, the
                app pulls a genuinely random number from a quantum source and uses it
                to choose one. The weights set the odds, since an option's chance is
                its weight divided by the total of both. Equal weights give a clean
                fifty-fifty.
              </p>
              <p className="mt-3">
                The name comes from the Everett, or Many-Worlds, picture of quantum
                mechanics. In that view a quantum measurement does not select one
                outcome and throw the others away. Every outcome happens, and the world
                branches so there is a version of events for each one. Here, the quantum
                number is that measurement, and the result simply tells you which branch
                you are reading this in.
              </p>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">Where the number comes from</p>
              <p>
                Each split asks several independent sources at once and mixes whatever
                answers into a single number by hashing them together, so the result
                stays unpredictable as long as any one source is honest:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3 marker:text-white/40">
                <li>
                  <span className="text-white">Quantum vacuum</span>
                  <span className="text-white/60"> · qrandom.io.</span> Vacuum
                  fluctuations measured on quantum hardware.
                </li>
                <li>
                  <span className="text-white">ANU</span>
                  <span className="text-white/60"> · quantumnumbers.anu.edu.au.</span> A
                  vacuum-fluctuation quantum generator, active once a key is set.
                </li>
                <li>
                  <span className="text-white">NIST beacon</span>
                  <span className="text-white/60"> · beacon.nist.gov.</span> Independent,
                  cryptographically signed randomness pulses.
                </li>
                <li>
                  <span className="text-white">INMETRO beacon</span>
                  <span className="text-white/60"> · beacon.inmetro.gov.br.</span>
                  Brazil's signed randomness beacon.
                </li>
              </ul>
              <p className="mt-3">
                The genuinely quantum sources, the vacuum and ANU, carry the quantum
                promise. The beacons add extra independent entropy. If nothing can be
                reached, the app uses your device's own secure generator and labels that
                result "not quantum," so you always know what produced your answer.
              </p>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">But what is really going on?</p>
              <p>
                Words like universe and split are friendly stand-ins for a description
                that is really mathematical. It is a little like picturing several
                ordinary universes that branch apart, where the weights are your chances
                of waking up in each branch. That image helps, but it is not literally
                what exists. Underneath there are no separate universes and no separate
                copies of you. There is only the wave function, evolving smoothly. The
                branches, and the people inside them, are patterns that emerge from it
                rather than extra pieces bolted on.
              </p>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">Why did you make this?</p>
              <p>
                A few reasons. I believe parallel universes are real and that the
                choices we make matter. Quantum physics and astrophysics have pulled at
                me for years, and I tend to pour everything I have into whatever I take
                on. Plenty of paths tempted me first. For a while I wanted to fly planes,
                then I wanted to play football. I came to quantum mechanics partly
                because I love the thought that somewhere there is a branch where each of
                those other choices worked out too.
              </p>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">Do I have to do whatever it says?</p>
              <p>
                No. Treat it like a magic eight ball. The universe branches the moment
                you split, whether or not you actually go and do the thing you typed in.
                The answer is a nudge, not an order.
              </p>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">Books and suggestions</p>
              <p>
                My own way into this was Sean Carroll's book{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Something_Deeply_Hidden"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Something Deeply Hidden
                </a>
                , which I recommend without reservation. If you want the careful argument
                for where the probabilities come from in Many-Worlds, his paper{" "}
                <a
                  href="https://arxiv.org/abs/1405.7907"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Many Worlds, the Born Rule, and Self-Locating Uncertainty
                </a>{" "}
                is well worth your time.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-xl leading-relaxed text-white/85">
            <section>
              <p className="text-3xl text-white mb-1">Privacy Policy</p>
              <p className="text-base text-white/50">Last updated: June 12, 2026</p>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">No data collection</p>
              <p>
                This Universe Splitter is built privacy first. It does not collect,
                store, or transmit any personal information or anything about the
                decisions you make.
              </p>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">What it never stores</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-white/40">
                <li>The options or outcomes you enter</li>
                <li>Personal information</li>
                <li>Usage analytics</li>
                <li>Cookies or browser storage</li>
                <li>IP addresses or device identifiers</li>
              </ul>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">How it works</p>
              <p>
                Your options and outcomes never leave your browser. Every split is
                processed locally, using quantum randomness fetched from public research
                sources. The only network requests fetch random numbers, and they carry
                nothing about you. The sources are:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3 marker:text-white/40">
                <li>
                  <span className="text-white">Quantum vacuum</span>
                  <span className="text-white/60"> · qrandom.io.</span> Vacuum
                  fluctuations measured on quantum hardware.
                </li>
                <li>
                  <span className="text-white">ANU</span>
                  <span className="text-white/60"> · quantumnumbers.anu.edu.au.</span> A
                  vacuum-fluctuation quantum generator.
                </li>
                <li>
                  <span className="text-white">NIST beacon</span>
                  <span className="text-white/60"> · beacon.nist.gov.</span> Signed
                  randomness pulses.
                </li>
                <li>
                  <span className="text-white">INMETRO beacon</span>
                  <span className="text-white/60"> · beacon.inmetro.gov.br.</span>
                  Brazil's signed randomness beacon.
                </li>
              </ul>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">Third-party services</p>
              <p>
                The randomness comes from the institutions listed above. Those requests
                include no personal information, only a plain ask for random numbers.
                Each provider runs its own service and may have its own privacy policy
                covering its endpoint.
              </p>
            </section>

            <section>
              <p className="text-2xl text-white mb-2">Open source</p>
              <p>
                The code is open for you to read, so you can verify every claim on this
                page yourself, available{" "}
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  on GitHub
                </a>
                .
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoModal;
