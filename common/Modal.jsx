"use client";

import Image from "next/image";
import modalImg from "@assets/images/modalImage.png";
import { formatDate } from "@utils/date";
import Link from "next/link";
import Loader from "./Loader";

export default function Modal({
  isOpen,
  onClose,
  isLoading,
  width = "512",
  children
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        style={{ maxWidth: `${width}px` }}
        className={`w-11/12 md:w-8/12 lg:w-11/12 max-h-[90%] overflow-y-auto bg-white p-8 rounded-[10px] shadow-lg relative`}>
        <button
          onClick={onClose}
          className="absolute top-7.5 right-8 p-1.5 border border-[#9C9C9C] rounded-[5px] hover:bg-slate-50 "
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#9C9C9C" />
          </svg>
        </button>
        <div className="w-full">
          {
            children
          }
        </div>
      </div>
    </div>
  );
}
