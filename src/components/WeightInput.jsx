import React from "react";

const WeightInput = ({ value, onChange }) => {
    // Keep only positive whole numbers. The field stays editable while typing
    // (an empty string is allowed mid-edit) but a negative, decimal, or any
    // non-digit can never make it into state.
    const handleChange = (e) => {
        // Strip everything that isn't a digit, then drop leading zeros.
        const cleaned = e.target.value.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");
        onChange(cleaned);
    };

    // type="number" still lets the keyboard insert "-", "+", "e" and ".".
    // Block them at the source so a negative can't even be typed.
    const handleKeyDown = (e) => {
        if (["-", "+", "e", "E", ".", ","].includes(e.key)) e.preventDefault();
    };

    // Block pasting anything that contains a non-digit.
    const handlePaste = (e) => {
        const text = (e.clipboardData || window.clipboardData).getData("text");
        if (/\D/.test(text)) e.preventDefault();
    };

    // When the field loses focus, snap empty / zero back up to the minimum of 1.
    const handleBlur = (e) => {
        const n = parseInt(e.target.value, 10);
        onChange(String(!n || n < 1 ? 1 : n));
    };

    return (
        <input
        type="number"
        inputMode="numeric"
        value={value}
        min="1"
        step="1"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
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
