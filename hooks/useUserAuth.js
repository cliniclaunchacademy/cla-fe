"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUserDetails } from "@api/ApiAuth";

export const useUserAuth = () => {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isAdminLoginRoute = pathname === "/login";

  const [roleChecked, setRoleChecked] = useState(false);

  // fetch user details
  const { mutateAsync: fetchUserDetails } = useMutation({
    mutationFn: getUserDetails,
  });

  useEffect(() => {
    const checkRole = async () => {
      const response = await fetchUserDetails();
      const role = response?.data?.data?.role;

      if (role !== "admin" && role !== "superAdmin") {
        router.push("/login");
      }
      setRoleChecked(true); // allow rendering
    };

    if (!isAdminLoginRoute) {
      checkRole();
    } else {
      setRoleChecked(true);
    }
  }, [isAdminLoginRoute, fetchUserDetails, router]);

  return { roleChecked, isAdminLoginRoute };
};
