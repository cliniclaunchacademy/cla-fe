"use client";

import HamburgerIcon from "@assets/icons/hamburgerIcon";
import { useState } from "react";
import Loader from "@common/Loader";
import { useAdminAuth } from "hooks/useAdminAuth";
import "./LayoutWrapper.css";
import Sider from "../Sider/Sider";

const LayoutWrapper = ({ children }) => {
  const { roleChecked, isAdminAuthRoute } = useAdminAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // if (!roleChecked) return <div className="h-screen flex items-center justify-center">
  //   <Loader isLoading={true}></Loader>
  // </div>;

  // route page
  if (!isAdminAuthRoute) {
    return (
      <main className="relative w-full flex h-screen overflow-hidden ">
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
            md:ml-[256px]
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

          {/* Scrollable children */}
          <div className="row-start-2 overflow-y-auto min-h-0 h-full"
          >
            <div className="w-full bg-[#121415] min-h-screen text-[#EFEFEE] ">
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