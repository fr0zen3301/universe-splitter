import React from "react";

const WeightInput = ({ value, onChange }) => {
    return (
        <input
        type="number"
        value={value}
        min="1"
        step="1"
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        className="
        w-[60px]
        text-center
        bg-transparent
        border-b
        border-white/70
        text-white
        text-2xl
        focus:outline-none
        focus:border-white
        selection:bg-white/20
        "
        />
    );
};

export default WeightInput;