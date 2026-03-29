"use client";
import LeftArrowIcon from "@assets/icons/leftArrowIcon";
import RightArrowIcon from "@assets/icons/rightArrowIcon";
import React from "react";

const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="flex items-center gap-3 mb-8">
      {/* Previous Button */}
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="h-8 w-8 flex items-center justify-center bg-[#E5E5E5] rounded-[5px] disabled:opacity-30 cursor-pointer"
      >
        <LeftArrowIcon color={"#929292"} width={20} height={20} />
      </button>

      {/* Current Page */}
      <button className="h-8 w-8 bg-[#3D3D3D] rounded-[5px] text-white textLabel12">
        {page}
      </button>

      <span>of</span>

      {/* Total Pages */}
      <button className="h-8 w-8 border border-[#3D3D3D] rounded-[5px] text-[#3D3D3D] textLabel12">
        {totalPages}
      </button>

      {/* Next Button */}
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="h-8 w-8 flex items-center justify-center bg-[#E5E5E5] rounded-[5px] disabled:opacity-30 cursor-pointer"
      >
        <RightArrowIcon color={"#929292"} width={20} height={20} />
      </button>
    </div>
  );
};

export default Pagination;
