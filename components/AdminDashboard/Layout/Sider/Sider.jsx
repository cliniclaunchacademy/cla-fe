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
    router.push("/login");
  };

  console.log(active);

  // ✅ Proper active route logic
  const isActiveRoute = (href) => {
    if (!href) return false;

    const isRoutesActive = pathname === href;
    const isRoutesChildrenActive =
      isRoutesActive || pathname.startsWith(href + "/");

    return href === "/admin"
      ? isRoutesActive
      : isRoutesChildrenActive;
  };

  const getIconClasses = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-[8px] border-2
   ${isActiveRoute(path)
      ? "bg-[linear-gradient(90deg,rgba(170,124,48,0.4)_0%,rgba(170,124,48,0.2)_100%)] text-white border-[#37352B]"
      : "text-[#ABADAF] border-[rgba(55,53,43,0)] hover:border-[rgba(55,53,43,0)] hover:bg-[#17191B]"
    }`;

  return (
    <section
      className={`fixed top-0 left-0 z-50 h-screen w-[256px] bg-[#0A0A0A] text-[#FFFAFA]
    transform transition-transform duration-300 ease-in-out
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 pt-[26px] pb-4 `} // desktop always open
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

        <div className="flex-1 flex-col space-y-1 px-[14px] py-6 overflow-y-auto sider-scrollbar">
          <Link
            href="/admin"
            className={getIconClasses("/admin")}
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
          <Link
            href="/admin/labApplications"
            className={getIconClasses("/admin/labApplications")}
          >
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.00977 15C8.56205 15 9.00977 15.4477 9.00977 16C9.00977 16.5523 8.56205 17 8.00977 17H8C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15H8.00977ZM16 15C16.5523 15 17 15.4477 17 16C17 16.5523 16.5523 17 16 17H12C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15H16ZM8.00977 10C8.56205 10 9.00977 10.4477 9.00977 11C9.00977 11.5523 8.56205 12 8.00977 12H8C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10H8.00977ZM16 10C16.5523 10 17 10.4477 17 11C17 11.5523 16.5523 12 16 12H12C11.4477 12 11 11.5523 11 11C11 10.4477 11.4477 10 12 10H16ZM15 3H9V5H15V3ZM17 5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5H6C5.73478 5 5.4805 5.10543 5.29297 5.29297C5.10543 5.4805 5 5.73478 5 6V20C5 20.2652 5.10543 20.5195 5.29297 20.707C5.48051 20.8946 5.73478 21 6 21H18C18.2652 21 18.5195 20.8946 18.707 20.707C18.8946 20.5195 19 20.2652 19 20V6C19 5.73478 18.8946 5.48051 18.707 5.29297C18.5195 5.10543 18.2652 5 18 5H17ZM18 3C18.7956 3 19.5585 3.3163 20.1211 3.87891C20.6837 4.44152 21 5.20435 21 6V20C21 20.7957 20.6837 21.5585 20.1211 22.1211C19.5585 22.6837 18.7957 23 18 23H6C5.20435 23 4.44152 22.6837 3.87891 22.1211C3.3163 21.5585 3 20.7957 3 20V6C3 5.20435 3.3163 4.44152 3.87891 3.87891C4.44152 3.3163 5.20435 3 6 3H7C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3H18Z" fill="#DFE1E3" />
              </svg>

            </span>
            <p className="">Lab Applications</p>
          </Link>
        </div>

        <div className="border-0 border-t-2 border-[#26282A] pt-6 px-[14px] ">
          <div className="bg-[#AA7C3012] py-2.5 px-3 border border-[#2E2D26] rounded-[8px] flex gap-3 items-center mb-4">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" fill="#AA7C30" fill-opacity="0.2" />
              <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" stroke="#514920" />
              <path d="M27 19C27 16.7909 25.2091 15 23 15C20.7909 15 19 16.7909 19 19C19 21.2091 20.7909 23 23 23C25.2091 23 27 21.2091 27 19ZM29 19C29 20.946 28.0726 22.6742 26.6367 23.7705C27.6434 24.2154 28.571 24.8424 29.3643 25.6357C31.0521 27.3236 32 29.6131 32 32C32 32.5523 31.5523 33 31 33C30.4477 33 30 32.5523 30 32C30 30.1435 29.2629 28.3626 27.9502 27.0498C26.6374 25.7371 24.8565 25 23 25C21.1435 25 19.3626 25.7371 18.0498 27.0498C16.7371 28.3626 16 30.1435 16 32C16 32.5523 15.5523 33 15 33C14.4477 33 14 32.5523 14 32C14 29.6131 14.9479 27.3236 16.6357 25.6357C17.4288 24.8427 18.3559 24.2153 19.3623 23.7705C17.9268 22.6742 17 20.9457 17 19C17 15.6863 19.6863 13 23 13C26.3137 13 29 15.6863 29 19Z" fill="#B88934" />
            </svg>
            <div>
              <p className="textLabel16 text-[#DFE1E3] ">Test Student</p>
              <p className="textBody12 text-[#ABADAF] ">teststudent@lms.local</p>
            </div>

          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-[8px] px-3 py-2.5 flex items-center gap-3 textLabel16 text-[#ABADAF] hover:bg-[#17191B] transition duration-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 19V5C2 4.20435 2.3163 3.44152 2.87891 2.87891C3.44152 2.3163 4.20435 2 5 2H9C9.55228 2 10 2.44772 10 3C10 3.55228 9.55228 4 9 4H5C4.73478 4 4.4805 4.10543 4.29297 4.29297C4.10543 4.4805 4 4.73478 4 5V19C4 19.2652 4.10543 19.5195 4.29297 19.707C4.48051 19.8946 4.73478 20 5 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H5C4.20435 22 3.44152 21.6837 2.87891 21.1211C2.3163 20.5585 2 19.7957 2 19ZM15.293 6.29297C15.6835 5.90244 16.3165 5.90244 16.707 6.29297L21.707 11.293C22.0976 11.6835 22.0976 12.3165 21.707 12.707L16.707 17.707C16.3165 18.0976 15.6835 18.0976 15.293 17.707C14.9024 17.3165 14.9024 16.6835 15.293 16.293L18.5859 13H9C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11H18.5859L15.293 7.70703C14.9024 7.31651 14.9024 6.68349 15.293 6.29297Z" fill="currentColor" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Sider;
