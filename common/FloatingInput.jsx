"use client";
import { useState } from "react";

const FloatingInput = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = `${label}`;

  const isActive = isFocused || value;

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="peer w-full border-b-[1.5px] border-[#929292] bg-transparent p-3 pt-[22px] text-sm text-gray-900 focus:outline-none focus:border-[#45A08B]"
      />
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-300 text-[#929292] ${
          isActive ? "top-0 text-xs " : "top-6 textBody16 "
        }`}
      >
        {label}
      </label>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FloatingInput;
