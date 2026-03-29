"use client";

import Sider from "../Sider/Sider";
import Header from "../Header/Header";
import HamburgerIcon from "@assets/icons/hamburgerIcon";
import { useState } from "react";
import Loader from "@common/Loader";
import { useAdminAuth } from "hooks/useAdminAuth";
import "./LayoutWrapper.css";

const LayoutWrapper = ({ children }) => {
  const { roleChecked, isAdminLoginRoute } = useAdminAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!roleChecked) return <div className="h-screen flex items-center justify-center">
    <Loader isLoading={true}></Loader>
  </div>;

  // route page
  if (!isAdminLoginRoute) {
    return (
      <main className="relative w-full flex h-screen overflow-hidden bg-[#663F7E]">
        {/* Sidebar */}
        <Sider isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        {/* Backdrop for mobile */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Main content */}
        <div
          className="
            w-full
            md:ml-[180px]
            grid
            grid-rows-[auto_auto_minmax(0,1fr)]
            transition-all duration-300
            overflow-hidden
            h-screen
          "
        >
          {/* Hamburger button (mobile) */}
          <div className="row-start-1">
            <button
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="md:hidden ms-6 my-2"
            >
              <HamburgerIcon className="text-black" />
            </button>
          </div>

          {/* Header*/}
          <div className="row-start-2">
            <Header />
          </div>

          {/* Scrollable children */}
          <div className="row-start-3 overflow-y-auto min-h-0 h-full gradient-border"
          >
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};

export default LayoutWrapper;