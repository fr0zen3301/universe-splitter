import React, { useState, useRef } from "react";

const EditableOption = ({ value, onChange }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);

    const handleClick = () => {
        setEditing(true);

        // Select all text when entering edit mode
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.select();
            }
        }, 0);
    };

    const handleBlur = () => {
        setEditing(false);
    };

    return (
        <div className="w-full border-b border-white/40 py-4">
            {editing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={handleBlur}
                    className="
                        w-full
                        bg-transparent
                        text-white
                        text-left
                        focus:outline-none
                        tracking-wide
                    "
                />
            ) : (
                <p
                    onClick={handleClick}
                    className="
                        text-white 
                        tracking-wide
                        cursor-pointer
                    "
                >
                    {value}
                </p>
            )}
        </div>
    );
};

export default EditableOption;
