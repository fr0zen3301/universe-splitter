import React from "react";

const OptionInput = ({ value, onChange, placeholder}) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="
            w-full 
            bg-transparent 
            border-b border-white/70 
            text-white-400 
            focus:outline-none 
            focus: border-white-300
            tracking-wide 
            placeholder-white-600
            text-start
            selection:bg-white/20"
        />
    );
};

export default OptionInput;