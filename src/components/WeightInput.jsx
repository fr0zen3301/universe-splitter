import React from "react";

const WeightInput = ({ value, onChange }) => {
    return (
        <input
        type="number"
        value={value}
        min="0"
        step="0.01"
        onChange={ ( e ) => onChange(e.target.value)}
        className="
        w-[60px
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