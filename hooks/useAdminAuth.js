"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUserDetails } from "@api/ApiAuth";

export const useAdminAuth = () => {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isAdminAuthRoute = pathname === "/login" || pathname === "/signup" || pathname === "/admin/signup";

  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    if (isAdminAuthRoute) {
      setRoleChecked(true);
      return;
    }

    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (pathname.startsWith("/admin") && role !== "admin" && role !== "superAdmin") {
      router.push("/login");
      return;
    }

    setRoleChecked(true);
  }, [isAdminAuthRoute, pathname, router]);

  return { roleChecked, isAdminAuthRoute };
};
