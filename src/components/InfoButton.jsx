import React from 'react';
import FuzzyText from './FuzzyText';

const InfoButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group inline-clokc border-b-2 border-whote pb-0 px-0"
    >
      <FuzzyText
        fontSize="1.8rem"
        baseIntensity={0.1}
        hoverIntensity={0.3}
        enableHover={true}
      >
        More Info
      </FuzzyText>
    </button>
  );
};

export default InfoButton;
