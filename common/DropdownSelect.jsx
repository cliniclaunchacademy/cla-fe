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
    <div className="relative w-[145px] text-[#DFE1E3] textLabel16 " ref={dropdownRef}>
      <button
        className="w-full px-[14px] py-[13px] border-2 border-[#ABADAF] rounded-[10px] flex justify-between items-center text-left focus:outline-none bg-transparent hover:bg-[#313335] active:bg-transparent transition duration-300 "
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selected}</span>
        <DownArrowIcon
            className={`text-[#DFE1E3] transition-transform duration-300 ${
            isOpen ? "-rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-transparent border border-[#E5E5E5] rounded-[5px] shadow-lg max-h-60 overflow-y-auto">
          {filters.map((filter) => (
            <li
              key={filter.key}
              onClick={() => handleSelect(filter)}
              className={`text-[#DFE1E3] textBody16 px-4 py-2 border-l-[4px] border-transparent cursor-pointer hover:bg-[#313335] ${
                selected === filter.label
                  ? "bg-transparent font-semibold !border-transparent"
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
