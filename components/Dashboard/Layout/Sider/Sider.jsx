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
    `flex items-center gap-3 px-3 py-2.5 rounded-[8px] ${isActiveRoute(path) ? "bg-[#3e301c] text-white" : " text-[#ABADAF]"}`;

  return (
    <section
      className={`fixed top-0 left-0 z-50 h-screen w-[256px] bg-[#0A0A0A] text-[#FFFAFA]
    transform transition-transform duration-300 ease-in-out
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 pt-[26px] pb-[16px]`} // desktop always open
      style={{ minHeight: "100vh" }}
    >
      <div className="h-full flex flex-col  ">
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="md:hidden absolute top-2 right-2 border rounded-lg p-1 bg-[#45A08B]"
        >
          <CancelIcon />
        </button>

        {/* Logo & title */}
        <div className="flex justify-between px-[26px] pb-[26px] border-0 border-b-2 border-b-[#26282A] ">
          <Image
            className=""
            src={logo}
            width={44}
            height={44}
            alt=""
          />
          <button className="bg-[#17191B] hover:bg-[#23272a] active:bg-[#17191B] rounded-[8px] p-[11px] transition duration-300 " >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7956 18.7917C12.0488 18.3533 12.6096 18.2029 13.048 18.4561C13.4864 18.7092 13.6367 19.27 13.3837 19.7084C13.1423 20.1264 12.7946 20.4733 12.3766 20.7146C11.9586 20.9559 11.4843 21.0834 11.0016 21.0834C10.519 21.0834 10.0446 20.9559 9.62662 20.7146C9.20874 20.4733 8.86173 20.1263 8.62043 19.7084C8.36728 19.27 8.5177 18.7092 8.95612 18.4561C9.39445 18.2032 9.95446 18.3535 10.2076 18.7917C10.288 18.9311 10.404 19.047 10.5433 19.1274C10.6826 19.2078 10.8408 19.25 11.0016 19.2501C11.1624 19.2501 11.3207 19.2078 11.4599 19.1274C11.5993 19.047 11.7152 18.9311 11.7956 18.7917ZM15.5849 7.33341C15.5849 6.118 15.1024 4.95236 14.2431 4.09285C13.3835 3.23331 12.2172 2.75008 11.0016 2.75008C9.78612 2.75014 8.62055 3.23337 7.76106 4.09285C6.90159 4.95239 6.41828 6.11789 6.41828 7.33341C6.41828 9.49148 6.08003 10.9984 5.53205 12.1584C4.9908 13.3042 4.27254 14.0439 3.66918 14.6667H18.3349C17.7303 14.0436 17.0131 13.3034 16.4721 12.1584C15.9239 10.9982 15.5849 9.49138 15.5849 7.33341ZM17.4183 7.33341C17.4183 9.29938 17.7262 10.5224 18.1291 11.3752C18.432 12.0163 18.8052 12.4872 19.2301 12.948L19.6715 13.4117L19.6912 13.4332C19.9303 13.696 20.0881 14.0224 20.145 14.3731C20.2019 14.7236 20.1561 15.0832 20.0125 15.408C19.8688 15.7328 19.6334 16.0091 19.3358 16.2029C19.0751 16.3725 18.7762 16.4733 18.4674 16.4956L18.3349 16.5001H3.66828C3.31296 16.4998 2.96504 16.3961 2.66747 16.202C2.36988 16.0078 2.13495 15.7313 1.99161 15.4062C1.84831 15.0811 1.80264 14.7211 1.86001 14.3704C1.91742 14.02 2.07544 13.6938 2.31477 13.4314L2.33357 13.4108C2.94265 12.782 3.47036 12.23 3.87418 11.3752C4.277 10.5224 4.58495 9.29941 4.58495 7.33341C4.58495 5.63161 5.26147 3.99909 6.46483 2.79574C7.66811 1.59264 9.30005 0.916808 11.0016 0.916748C12.7034 0.916748 14.3359 1.59245 15.5393 2.79574C16.7427 3.99909 17.4183 5.63161 17.4183 7.33341Z" fill="#ABADAF" />
            </svg>
          </button>
        </div>

        {/* <div className="flex-1 flex-col space-y-[36px] px-[14px] py-6 overflow-y-auto sider-scrollbar">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-y-[5px] px-3 "
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
        </div> */}
        <div className="flex-1 flex-col space-y-1 px-[14px] py-6 overflow-y-auto sider-scrollbar">
          <Link
            href="/dashboard"
            className={getIconClasses("/dashboard")}
          >
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4V11H9V4H4ZM11 11C11 12.1046 10.1046 13 9 13H4C2.89543 13 2 12.1046 2 11V4C2 2.89543 2.89543 2 4 2H9C10.1046 2 11 2.89543 11 4V11Z" fill="currentColor" />
                <path d="M15 4V7H20V4H15ZM22 7C22 8.10457 21.1046 9 20 9H15C13.8954 9 13 8.10457 13 7V4C13 2.89543 13.8954 2 15 2H20C21.1046 2 22 2.89543 22 4V7Z" fill="currentColor" />
                <path d="M15 13V20H20V13H15ZM22 20C22 21.1046 21.1046 22 20 22H15C13.8954 22 13 21.1046 13 20V13C13 11.8954 13.8954 11 15 11H20C21.1046 11 22 11.8954 22 13V20Z" fill="currentColor" />
                <path d="M4 17V20H9V17H4ZM11 20C11 21.1046 10.1046 22 9 22H4C2.89543 22 2 21.1046 2 20V17C2 15.8954 2.89543 15 4 15H9C10.1046 15 11 15.8954 11 17V20Z" fill="currentColor" />
              </svg>
            </span>
            <p className="">Dashboard</p>
          </Link>
          {/* <button
            onClick={handleLogout}
            className="w-full flex flex-col items-center justify-center gap-y-[21.5px] "
          >
            <span >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#FFFAFA" />
              </svg>

            </span>
            <p className="">Logout</p>
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default Sider;
