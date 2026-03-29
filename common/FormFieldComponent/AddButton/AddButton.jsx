import AddIcon from "@assets/icons/DashboardIcon/AddIcon";
import Link from "next/link";
import React from "react";

const AddButton = ({ href = "", label = "" }) => {
  return (
    <Link
      href={href}
      className="w-fit ps-4 pe-6 py-3.5 rounded-[100px] bg-[#45A08B] flex items-center gap-2"
    >
      <AddIcon />
      <span className="text-center align-middle font-medium text-[16px] leading-[24px] tracking-[0.02em] text-white">
        {label}
      </span>
    </Link>
  );
};

export default AddButton;
