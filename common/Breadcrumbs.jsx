"use client";

import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  const filteredParts = pathParts.filter(
    (part) => part !== "dashboard" && isNaN(Number(part))
  );

  const ArrowIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline mx-1"
    >
      <path
        d="M5.34935 14.6668L4.16602 13.4835L9.64935 8.00016L4.16602 2.51683L5.34935 1.3335L12.016 8.00016L5.34935 14.6668Z"
        fill="#3D3D3D"
      />
    </svg>
  );

  // Special Case: Only dashboard
  if (pathname === "/dashboard") {
    return <div className="text-gray-500 text-sm">Dashboard</div>;
  }

  return (
    <div className="flex items-center space-x-1 textBody16 text-[#3D3D3D]">
      {pathname === "/dashboard" && (
        <>
          {" "}
          <span>Dashboard</span> <ArrowIcon />{" "}
        </>
      )}

      {filteredParts.map((part, index) => {
        const formatted = part
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/^./, (s) => s.toUpperCase());

        return (
          <div key={index}>
            <span>{formatted}</span>
            {index < filteredParts.length - 1 && <ArrowIcon />}
          </div>
        );
      })}
    </div>
  );
}
