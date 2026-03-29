"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUserDetails } from "@api/ApiAuth";

export const useAdminAuth = () => {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isAdminAuthRoute = (pathname === "/dashboard/login") || (pathname === "/dashboard/signup");

  const [roleChecked, setRoleChecked] = useState(false);

  // // fetch user details
  // const { mutateAsync: fetchUserDetails } = useMutation({
  //   mutationFn: getUserDetails,
  // });

  // useEffect(() => {
  //   const checkRole = async () => {
  //     const response = await fetchUserDetails();
  //     const role = response?.data?.data?.role;

  //     if (role !== "admin" && role !== "superAdmin") {
  //       router.push("/dashboard/login");
  //     }
  //     setRoleChecked(true); // allow rendering
  //   };

  //   if (!isAdminAuthRoute) {
  //     checkRole();
  //   } else {
  //     setRoleChecked(true);
  //   }
  // }, [isAdminAuthRoute, fetchUserDetails, router]);

  return { roleChecked, isAdminAuthRoute };
};
