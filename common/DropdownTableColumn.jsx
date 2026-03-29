"use client";

import DownArrowIcon from "@assets/icons/downArrowIcon";
import { useState, useRef, useEffect } from "react";

const DropdownTableColumn = ({ filters = [], onChange }) => {
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
    <div className="relative text-[#3D3D3D] redhat " ref={dropdownRef}>
      <button
        className="text-[#5954FF] underline decoration-1"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        3 courses
      </button>

      {isOpen && (
        <ul className="w-[232px] absolute z-10 mt-1 bg-[#FBF6FF] shadow-[0px_4px_4px_0px_#00000026] max-h-60 overflow-y-auto">
          <li
            className={`text-[#663F7E] textLabel14 px-2 py-1.5 border-b-[1px] border-slate-200 cursor-pointer hover:bg-slate-100  `}
          >
            Courses
          </li>
          {filters.map((filter) => (
            <li
              key={filter.key}
              onClick={() => handleSelect(filter)}
              className={`text-[#737272] textBody14 px-2 py-1.5 border-b-[1px] border-slate-200 cursor-pointer hover:bg-slate-100  `}
            >
              {filter.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownTableColumn;
