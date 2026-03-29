"use client";

import UserIcon from "@assets/icons/DashboardIcon/UserIcon";
import Breadcrumbs from "@common/Breadcrumbs";
import { today } from "@utils/date";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [todayDate, setTodayDate] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    setRole(storedRole);
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    setTodayDate(today("dddd, DD MMM YYYY"));
  }, []);

  return (
    <div className="w-full h-fit bg-[#663F7E] p-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-y-2 px-4 ">
      <div>
        {/* <Breadcrumbs /> */}
        <p className="merriweather textLabel16 !font-bold text-[#FFFAFA] ">Welcome Dr. Puuja Arora!</p>
      </div>
      <div className="flex gap-4 items-center ">
        <span className="p-1">
          <UserIcon />
        </span>
        <p className="textLabel14 text-[#FFFAFA] ">drpuujaarora@gmail.com</p>
      </div>
    </div>
  );
};

export default Header;
