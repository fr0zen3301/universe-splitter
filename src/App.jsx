import React, { useState } from "react";
import '../src/GlitchEffect.css'
import FuzzyText from './components/FuzzyText';
import OptionInput from "./components/OptionInput";
import InfoButton from "./components/InfoButton";
import EditableOption from "./components/EditableOption";
import WeightInput from "./components/WeightInput";


const App = () => {
  const [option1, setOption1] = useState("Take a chance");
  const [option2, setOption2] = useState("Do not take a chance");

  const [weight1, setWeight1] = useState(1);
  const [weight2, setWeight2] = useState(1);

  return (<>
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
      <div id="bg" className="absolute inset-0 z-0"></div>
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
          <div className="glitch-box relative flex flex-col justify-center">
            <div className="w-full h-full p-[15px] flex flex-row gap-2 text-white font-frozen">
              <div className="w-[75%] pt-[45px] pl-[10px] flex flex-col gap-6 text-white-400 font-frozen text-3xl">
                <OptionInput
                  eight value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                  placeholder="Take a chance"
                />
                <OptionInput
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                  placeholder="Do not take a chance"
                />
              </div>
              <div className="w-[40px] ml-[50px] pt-[10px] flex flex-col items-center gap-6 text-white font-frozen text-2xl">
                <div className="text-2xl">Weight</div>
                {/* <div>
                  eightInput value={weight1} onChange={setWeight1} />
                  <WeightInput value={weight2} onChange={setWeight2} />
                </div> */}

              </div>
            </div>
            <div className="font-frozen text-white p-[10px] flex justify-center">
              <InfoButton onClick={() => console.log("Click")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default App;