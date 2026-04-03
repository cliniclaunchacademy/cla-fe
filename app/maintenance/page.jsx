"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logoImg from "@assets/images/logo.png";

export default function MaintenancePage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("maintenanceMessage");
    if (stored) setMessage(stored);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#121415" }}
    >
      {/* Logo */}
      <div className="mb-12">
        <Image src={logoImg} alt="Clinic Launch Academy" width={160} height={48} className="object-contain" />
      </div>

      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style={{ background: "#1C1E20", border: "1.5px solid #37352B" }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"
            stroke="#B88934"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1
        className="text-[32px] font-bold leading-tight text-center mb-3"
        style={{ color: "#DFE1E3" }}
      >
        Under Maintenance
      </h1>

      {/* Subheading */}
      <p
        className="text-[17px] text-center max-w-[460px] leading-relaxed mb-2"
        style={{ color: "#ABADAF" }}
      >
        {message ||
          "We are currently performing scheduled maintenance to improve your experience. Please check back soon."}
      </p>

      {/* Divider */}
      <div
        className="w-16 my-8"
        style={{ height: 1, background: "#37352B" }}
      />

      {/* Footer note */}
      <p className="text-[14px] text-center" style={{ color: "#868889" }}>
        If you have questions, reach out to your program support team.
      </p>
    </div>
  );
}
