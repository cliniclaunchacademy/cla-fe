"use client";

import Image from "next/image";
import logo from "@assets/images/logo.png";
import Link from "next/link";
import DashboardIcon from "@assets/icons/DashboardIcon/DashboardIcon";
import LogoutIcon from "@assets/icons/DashboardIcon/LogoutIcon";
import { usePathname, useRouter } from "next/navigation";
import CancelIcon from "@assets/icons/cancelIcon";
import { logout } from "@api/ApiAuth";
import { useEffect, useState, useCallback } from "react";
import "./Sider.css";
import NewsletterIcon from "@assets/icons/DashboardIcon/NewsletterIcon";
import NotificationPanel from "@components/Dashboard/NotificationPanel/NotificationPanel";
import { getStudentNotifications } from "apis/student-notifications.api";

const Sider = ({ isMobileOpen, setIsMobileOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [active, setActive] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const handleCloseNotif = useCallback(() => setNotifOpen(false), []);

  const syncFromStorage = () => {
    setRole(localStorage.getItem("role"));
    setUsername(localStorage.getItem("username") || "");
    setEmail(localStorage.getItem("email") || "");
    setProfilePhoto(localStorage.getItem("profilePhoto") || null);
  };

  useEffect(() => {
    syncFromStorage();
    window.addEventListener("app:profile-updated", syncFromStorage);
    return () => window.removeEventListener("app:profile-updated", syncFromStorage);
  }, []);

  // Fetch unread count on mount
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await getStudentNotifications();
      setUnreadCount(res.data?.unreadCount ?? 0);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => { fetchUnreadCount(); }, [fetchUnreadCount]);

  // Re-fetch count when panel closes so badge stays accurate
  useEffect(() => {
    if (!notifOpen) fetchUnreadCount();
  }, [notifOpen, fetchUnreadCount]);

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

    return href === "/"
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
            src={logo}
            width={72}
            height={72}
            alt=""
            style={{ width: '72px', height: 'auto' }}
          />
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative bg-[#17191B] hover:bg-[#23272a] active:bg-[#17191B] rounded-[8px] p-[11px] transition duration-300"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7956 18.7917C12.0488 18.3533 12.6096 18.2029 13.048 18.4561C13.4864 18.7092 13.6367 19.27 13.3837 19.7084C13.1423 20.1264 12.7946 20.4733 12.3766 20.7146C11.9586 20.9559 11.4843 21.0834 11.0016 21.0834C10.519 21.0834 10.0446 20.9559 9.62662 20.7146C9.20874 20.4733 8.86173 20.1263 8.62043 19.7084C8.36728 19.27 8.5177 18.7092 8.95612 18.4561C9.39445 18.2032 9.95446 18.3535 10.2076 18.7917C10.288 18.9311 10.404 19.047 10.5433 19.1274C10.6826 19.2078 10.8408 19.25 11.0016 19.2501C11.1624 19.2501 11.3207 19.2078 11.4599 19.1274C11.5993 19.047 11.7152 18.9311 11.7956 18.7917ZM15.5849 7.33341C15.5849 6.118 15.1024 4.95236 14.2431 4.09285C13.3835 3.23331 12.2172 2.75008 11.0016 2.75008C9.78612 2.75014 8.62055 3.23337 7.76106 4.09285C6.90159 4.95239 6.41828 6.11789 6.41828 7.33341C6.41828 9.49148 6.08003 10.9984 5.53205 12.1584C4.9908 13.3042 4.27254 14.0439 3.66918 14.6667H18.3349C17.7303 14.0436 17.0131 13.3034 16.4721 12.1584C15.9239 10.9982 15.5849 9.49138 15.5849 7.33341ZM17.4183 7.33341C17.4183 9.29938 17.7262 10.5224 18.1291 11.3752C18.432 12.0163 18.8052 12.4872 19.2301 12.948L19.6715 13.4117L19.6912 13.4332C19.9303 13.696 20.0881 14.0224 20.145 14.3731C20.2019 14.7236 20.1561 15.0832 20.0125 15.408C19.8688 15.7328 19.6334 16.0091 19.3358 16.2029C19.0751 16.3725 18.7762 16.4733 18.4674 16.4956L18.3349 16.5001H3.66828C3.31296 16.4998 2.96504 16.3961 2.66747 16.202C2.36988 16.0078 2.13495 15.7313 1.99161 15.4062C1.84831 15.0811 1.80264 14.7211 1.86001 14.3704C1.91742 14.02 2.07544 13.6938 2.31477 13.4314L2.33357 13.4108C2.94265 12.782 3.47036 12.23 3.87418 11.3752C4.277 10.5224 4.58495 9.29941 4.58495 7.33341C4.58495 5.63161 5.26147 3.99909 6.46483 2.79574C7.66811 1.59264 9.30005 0.916808 11.0016 0.916748C12.7034 0.916748 14.3359 1.59245 15.5393 2.79574C16.7427 3.99909 17.4183 5.63161 17.4183 7.33341Z" fill="#ABADAF" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#B88934] text-[#0A0A0A] text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel isOpen={notifOpen} onClose={handleCloseNotif} />
        </div>

        <div className="flex-1 flex-col space-y-1 px-[14px] py-6 overflow-y-auto sider-scrollbar">
          <Link
            href="/"
            className={getIconClasses("/")}
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
            href="/courses"
            className={getIconClasses("/courses")}
          >
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 16H16V20H19C19.5523 20 20 19.5523 20 19V16ZM10 20H14V16H10V20ZM16 14H20V10H16V14ZM10 14H14V10H10V14ZM4 14H8V10H4V14ZM10 8H14V4H10V8ZM4 19C4 19.5523 4.44771 20 5 20H8V16H4V19ZM20 5C20 4.44771 19.5523 4 19 4H16V8H20V5ZM4 8H8V4H5C4.44772 4 4 4.44772 4 5V8ZM22 19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19Z" fill="#DFE1E3" />
              </svg>
            </span>
            <p className="">Courses</p>
          </Link>
          <Link
            href="/recordings"
            className={getIconClasses("/recordings")}
          >
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
              </svg>
            </span>
            <p className="">Recordings</p>
          </Link>
          <Link
            href="/resources"
            className={getIconClasses("/resources")}
          >
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="">Resources</p>
          </Link>
          <Link
            href="/lab-partners"
            className={getIconClasses("/lab-partners")}
          >
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 9.08A2 2 0 0 1 18 21H6a2 2 0 0 1-1.755-2.96l5.51-9.08A2 2 0 0 0 10 8V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.453 15h11.094" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 2h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className="">Lab Partners</p>
          </Link>
          <Link
            href="/settings"
            className={getIconClasses("/settings")}
          >
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className="">Settings</p>
          </Link>
        </div>

        <div className="border-0 border-t-2 border-[#26282A] pt-6 px-[14px] ">
          <div className="bg-[#AA7C3012] py-2.5 px-3 border border-[#2E2D26] rounded-[8px] flex gap-3 items-center mb-4">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-[46px] h-[46px] rounded-full object-cover border border-[#514920]"
              />
            ) : (
              <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" fill="#AA7C30" fillOpacity="0.2" />
                <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" stroke="#514920" />
                <path d="M27 19C27 16.7909 25.2091 15 23 15C20.7909 15 19 16.7909 19 19C19 21.2091 20.7909 23 23 23C25.2091 23 27 21.2091 27 19ZM29 19C29 20.946 28.0726 22.6742 26.6367 23.7705C27.6434 24.2154 28.571 24.8424 29.3643 25.6357C31.0521 27.3236 32 29.6131 32 32C32 32.5523 31.5523 33 31 33C30.4477 33 30 32.5523 30 32C30 30.1435 29.2629 28.3626 27.9502 27.0498C26.6374 25.7371 24.8565 25 23 25C21.1435 25 19.3626 25.7371 18.0498 27.0498C16.7371 28.3626 16 30.1435 16 32C16 32.5523 15.5523 33 15 33C14.4477 33 14 32.5523 14 32C14 29.6131 14.9479 27.3236 16.6357 25.6357C17.4288 24.8427 18.3559 24.2153 19.3623 23.7705C17.9268 22.6742 17 20.9457 17 19C17 15.6863 19.6863 13 23 13C26.3137 13 29 15.6863 29 19Z" fill="#B88934" />
              </svg>
            )}
            <div>
              <p className="textLabel16 text-[#DFE1E3] ">{username}</p>
              <p className="textBody12 text-[#ABADAF] ">{email}</p>
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
