"use client";

import React, { useState } from "react";
import logo from "@assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import DropdownNav from "@common/DropdownNav";
import HamburgerIcon from "@assets/icons/hamburgerIcon";
import CancelIcon from "@assets/icons/cancelIcon";

const navItems = [
  { label: "Home", href: "/", type: "link" },
  { label: "My Courses", href: "/courses", type: "link" },
  { label: "My Profile", href: "/profile", type: "link" },
];

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <section className="w-full px-4 fixed top-4 left-0 z-50">
      <div className="w-full h-[62px] px-6 bg-[#02070A] rounded-[30px] flex items-center justify-between">
        <Link href="/" className="flex gap-2.5 items-center">
          {/* <Image src={logo} alt="Logo" /> */}
          <p className="uppercase text-[#F8F8F8] textLabel16">
            Video Streaming
          </p>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item, idx) =>
            item.type === "link" ? (
              <Link
                key={idx}
                href={item.href}
                className="text-[#F8F8F8] hover:text-[#45A08B] textBody16 transition duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <DropdownNav key={idx} label={item.label} items={item.items} />
            )
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="text-white"
          >
            {isMobileOpen ? <CancelIcon /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Desktop Admin button */}
        <Link href="/dashboard/login" className="hidden md:block px-4 py-2 border border-[#45A08B] rounded-[10px] text-[#45A08B] textBody16 hover:bg-[#45A08B33] transition duration-200">
          Admin Login
        </Link>
      </div>

      {isMobileOpen && (
        <div className="md:hidden mt-1 bg-[#02070A] rounded-[20px] py-6 text-white">
          <div className="max-h-[75vh] px-6 space-y-3 overflow-y-auto scrollbar-thin">
            {navItems.map((item, idx) =>
              item.type === "link" ? (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block textBody16 text-white hover:text-[#45A08B] transition duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <div key={idx}>
                  <p className="textBody16 font-semibold text-[#45A08B]">
                    {item.label}
                  </p>
                  <ul className="ml-4 mt-1 space-y-1">
                    {item.items.map((subItem, subIdx) =>
                      subItem.items ? (
                        <div key={subIdx}>
                          <p className="text-sm font-medium text-white mt-2">
                            {subItem.label}
                          </p>
                          <ul className="ml-4 mt-1 space-y-1">
                            {subItem.items.map((nestedItem, nestedIdx) => (
                              <li key={nestedIdx}>
                                <Link
                                  href={nestedItem.href}
                                  onClick={() => setIsMobileOpen(false)}
                                  className="text-sm text-white hover:text-[#45A08B] transition duration-200"
                                >
                                  {nestedItem.subLabel}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <li key={subIdx}>
                          <Link
                            href={subItem.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="text-sm text-white hover:text-[#45A08B] transition duration-200"
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )
            )}
            <Link href="/dashboard/login" className="block text-center w-full mt-4 px-4 py-2 border border-[#45A08B] rounded-[10px] text-[#45A08B] textBody16 hover:bg-[#45A08B33] transition duration-200">
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default Navbar;
