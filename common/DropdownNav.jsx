"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import DownArrowIcon from "@assets/icons/downArrowIcon";

const DropdownNav = ({ label, items = [], currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="relative w-fit" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex gap-2 items-center group"
      >
        <span
          className={`hover:text-[#45A08B] textBody16 ${isOpen ? "text-[#45A08B]" : "text-[#F8F8F8]"
            } transition duration-200`}
        >
          {label}
        </span>
        <DownArrowIcon
          className={`transition-transform duration-300 group-hover:text-[#45A08B] ${isOpen ? "rotate-180 text-[#45A08B]" : "rotate-0 text-[#929292]"
            }`}
        />
      </button>

      {isOpen && (
        <ul className="w-[184px] absolute z-10 mt-2 bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg max-h-60">
          {items.map((item) => {
            const isNested = item.items;
            const isActive = currentPath === item.href;

            return (
              <li key={item.label} className="relative group">
                <>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-[#242424] textBody16 ps-4 pl-[9px] py-2 border-l-[4px] border-transparent cursor-pointer hover:bg-[#D9FFF6] transition-colors duration-200 ${isActive
                      ? "bg-[#D9FFF6] font-semibold !border-[#45A08B]"
                      : ""
                      }`}
                  >
                    {item.label}
                  </Link>
                  {isNested && (
                    <>
                      {/* Nested submenu */}
                      <ul className="absolute left-full top-0 mt-0 ml-1 w-[200px] opacity-0 group-hover:opacity-100 bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg z-20 transition-all duration-300">
                        {item.items.map((subItem) => {
                          const isSubActive = currentPath === subItem.href;
                          return (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={`block text-[#242424] textBody16 px-4 py-2 border-l-[4px] border-transparent cursor-pointer hover:bg-[#D9FFF6] transition-colors duration-200 ${isSubActive
                                  ? "bg-[#D9FFF6] font-semibold !border-[#45A08B]"
                                  : ""
                                  }`}
                              >
                                {subItem.subLabel}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DropdownNav;
