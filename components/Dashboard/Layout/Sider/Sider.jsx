"use client";

import Image from "next/image";
import logo from "@assets/images/logo.png";
import Link from "next/link";
import DashboardIcon from "@assets/icons/DashboardIcon/DashboardIcon";
import LogoutIcon from "@assets/icons/DashboardIcon/LogoutIcon";
import { usePathname, useRouter } from "next/navigation";
import CancelIcon from "@assets/icons/cancelIcon";
import { logout } from "@api/ApiAuth";
import { useEffect, useState } from "react";
import "./Sider.css";
import NewsletterIcon from "@assets/icons/DashboardIcon/NewsletterIcon";

const Sider = ({ isMobileOpen, setIsMobileOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [active, setActive] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/dashboard/adminLogin");
  };

  console.log(active);

  // ✅ Proper active route logic
  const isActiveRoute = (href) => {
    if (!href) return false;

    const isRoutesActive = pathname === href;
    const isRoutesChildrenActive =
      isRoutesActive || pathname.startsWith(href + "/");

    return href === "/dashboard"
      ? isRoutesActive
      : isRoutesChildrenActive;
  };

  const getIconClasses = (path) =>
    `w-[48px] h-[48px] flex items-center justify-center rounded-full ${isActiveRoute(path) ? "bg-[linear-gradient(270deg,_#BA9532_0%,_#DEBC53_15.87%,_#F7EE89_34.62%,_#EAD26C_55.29%,_#D1AC47_77.88%,_#FAD36E_88.46%,_#DCB449_100%)] text-[#663F7E]" : "text-[#FFFAFA]"}`;

  return (
    <div
      className={`fixed top-0 left-0 z-50 h-screen w-[180px] bg-[#663F7E] text-[#FFFAFA]
    transform transition-transform duration-300 ease-in-out
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 `} // desktop always open
      style={{ minHeight: "100vh" }}
    >
      <div className="h-full flex flex-col px-2.5 py-6 overflow-y-auto sider-scrollbar">
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="md:hidden absolute top-2 right-2 border rounded-lg p-1 bg-[#45A08B]"
        >
          <CancelIcon />
        </button>

        {/* Logo & title */}
        <div className="">
          <Image
            className="mx-auto"
            src={logo}
            width={77}
            height={80}
            alt=""
          />
        </div>

        <div className="flex-1 flex-col space-y-[36px] pt-[72px] ">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center gap-y-[5px] "
          >
            <span className={getIconClasses("/dashboard")}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" fill="currentColor" />
              </svg>
            </span>
            <p className="">Dashboard</p>
          </Link>
          <Link
            href="/dashboard/courses"
            className="flex flex-col items-center justify-center gap-y-[5px] "
          >
            <span className={getIconClasses("/dashboard/courses")}>
              <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.75 21.2C2 21.2 1.35417 20.9458 0.8125 20.4375C0.270833 19.9292 0 19.3 0 18.55V4.6C0 3.96667 0.195833 3.4 0.5875 2.9C0.979167 2.4 1.49167 2.08333 2.125 1.95L12 0V16L2.525 17.9C2.375 17.9333 2.25 18.0125 2.15 18.1375C2.05 18.2625 2 18.4 2 18.55C2 18.7333 2.075 18.8875 2.225 19.0125C2.375 19.1375 2.55 19.2 2.75 19.2H14V3.2H16V21.2H2.75ZM3 15.775L5 15.375V3.425L3 3.825V15.775Z" fill="currentColor" />
              </svg>
            </span>
            <p className="">Course</p>
          </Link>
          <Link
            href="/dashboard/users"
            className="flex flex-col items-center justify-center gap-y-[5px] "
          >
            <span className={getIconClasses("/dashboard/users")}>
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM18 16V13C18 12.2667 17.7958 11.5625 17.3875 10.8875C16.9792 10.2125 16.4 9.63333 15.65 9.15C16.5 9.25 17.3 9.42083 18.05 9.6625C18.8 9.90417 19.5 10.2 20.15 10.55C20.75 10.8833 21.2083 11.2542 21.525 11.6625C21.8417 12.0708 22 12.5167 22 13V16H18ZM5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8C6.9 8 5.95833 7.60833 5.175 6.825ZM16.825 6.825C16.0417 7.60833 15.1 8 14 8C13.8167 8 13.5833 7.97917 13.3 7.9375C13.0167 7.89583 12.7833 7.85 12.6 7.8C13.05 7.26667 13.3958 6.675 13.6375 6.025C13.8792 5.375 14 4.7 14 4C14 3.3 13.8792 2.625 13.6375 1.975C13.3958 1.325 13.05 0.733333 12.6 0.2C12.8333 0.116667 13.0667 0.0625 13.3 0.0375C13.5333 0.0125 13.7667 0 14 0C15.1 0 16.0417 0.391667 16.825 1.175C17.6083 1.95833 18 2.9 18 4C18 5.1 17.6083 6.04167 16.825 6.825Z" fill="currentColor" />
              </svg>
            </span>
            <p className="">Users</p>
          </Link>
          <Link
            href="/dashboard/payment"
            className="flex flex-col items-center justify-center gap-y-[5px] "
          >
            <span className={getIconClasses("/dashboard/payment")}>
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16H2ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10C8 9.45 7.80417 8.97917 7.4125 8.5875C7.02083 8.19583 6.55 8 6 8V10H8ZM18 10H20V8C19.45 8 18.9792 8.19583 18.5875 8.5875C18.1958 8.97917 18 9.45 18 10ZM13 9C13.8333 9 14.5417 8.70833 15.125 8.125C15.7083 7.54167 16 6.83333 16 6C16 5.16667 15.7083 4.45833 15.125 3.875C14.5417 3.29167 13.8333 3 13 3C12.1667 3 11.4583 3.29167 10.875 3.875C10.2917 4.45833 10 5.16667 10 6C10 6.83333 10.2917 7.54167 10.875 8.125C11.4583 8.70833 12.1667 9 13 9ZM6 4C6.55 4 7.02083 3.80417 7.4125 3.4125C7.80417 3.02083 8 2.55 8 2H6V4ZM20 4V2H18C18 2.55 18.1958 3.02083 18.5875 3.4125C18.9792 3.80417 19.45 4 20 4Z" fill="currentColor" />
              </svg>

            </span>
            <p className="">Payment</p>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex flex-col items-center justify-center gap-y-[21.5px] "
          >
            <span >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#FFFAFA" />
              </svg>

            </span>
            <p className="">Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sider;
