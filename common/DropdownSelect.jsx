"use client";

import DownArrowIcon from "@assets/icons/downArrowIcon";
import { useState, useRef, useEffect } from "react";

const DropdownSelect = ({ filters = [], onChange }) => {
  // Default to first filter's label
  const [selected, setSelected] = useState(filters[0]?.label || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (filter) => {
    setSelected(filter.label);
    onChange?.(filter.key); // send back the key instead of label
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-[176px] text-[#3D3D3D] redhat " ref={dropdownRef}>
      <button
        className="w-full px-4 py-2 border border-[#B683D5] rounded-[10px] flex justify-between items-center text-left focus:outline-none hover:bg-[#ECE6F0]/20 transition duration-300"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selected}</span>
        <DownArrowIcon
            className={`text-[#C4C4C4] transition-transform duration-300 ${
            isOpen ? "-rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg max-h-60 overflow-y-auto">
          {filters.map((filter) => (
            <li
              key={filter.key}
              onClick={() => handleSelect(filter)}
              className={`text-[#242424] textBody16 px-4 py-2 border-l-[4px] border-transparent cursor-pointer hover:bg-slate-100 ${
                selected === filter.label
                  ? "bg-white font-semibold !border-[#B683D5]"
                  : ""
              }`}
            >
              {filter.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelect;
