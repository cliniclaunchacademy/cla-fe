"use client";

import DownArrowIcon from "@assets/icons/downArrowIcon";
import { useEffect, useRef, useState } from "react";

const TableDropdown = ({
  filters = [{ key: "", label: "", listLabel: "", value: "" }],
  onChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(filters[0]?.label || "");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection
  const handleSelect = (filter) => {
    setSelected(filter.label);
    onChange(filter.value);
    setIsOpen(false);
  };

  // Open dropdown using fixed positioning
  const openDropdown = () => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const dropdownMaxHeight = 170;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const shouldOpenUp = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;
    const top = shouldOpenUp
      ? rect.top - dropdownMaxHeight
      : rect.bottom;

    setDropdownStyle({
      position: "fixed",
      top,
      left: rect.left,
      width: rect.width,
      maxHeight: dropdownMaxHeight,
    });

    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-[168px]">
      {/* Button */}
      <button
        className="w-[168px] min-h-[40px] flex justify-between items-center px-4 py-2 rounded-[5px] border border-[#E5E5E5] shadow-[0px_2px_4px_0px_#00000026] bg-white text-[#001910] text-sm"
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
      >
        <span className="whitespace-normal break-words text-left flex-1">
          {selected}
        </span>
        <DownArrowIcon
          className={`ml-2 flex-shrink-0 text-[#929292] h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          className="fixed z-50 bg-white border border-[#E5E5E5] rounded-md shadow-md overflow-y-auto"
          style={dropdownStyle}
        >
          {filters.map((filter) => (
            <li
              key={filter.key}
              onClick={() => handleSelect(filter)}
              className="px-4 py-2 text-sm text-[#001910] hover:bg-[#e6f2ef] cursor-pointer whitespace-normal break-words"
            >
              {filter.listLabel || filter.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TableDropdown;