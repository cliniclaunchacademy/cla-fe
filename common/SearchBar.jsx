"use client";

import SearchIcon from "@assets/icons/searchIcon";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "",
}) {
  return (
    <div className="w-full h-[48px] max-w-[298px] flex rounded shadow-[0px_4px_4px_0px_#0000001A]">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full px-4 text-[#929292] focus:text-black textBody16 outline-none border border-[#E5E5E5] rounded-l-[5px]"
      />
      <button
        type="button"
        onClick={onSubmit}
        className="h-full p-3 bg-[#45A08B] hover:bg-[#45A08B]/90 rounded-r-[5px] px-4 text-white font-semibold transition-all duration-150"
      >
        <SearchIcon />
      </button>
    </div>
  );
}
