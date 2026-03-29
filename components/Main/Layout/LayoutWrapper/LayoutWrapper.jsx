"use client";

import { useEffect, useState } from "react";
import Loader from "@common/Loader";
import { usePathname, useRouter } from "next/navigation";

export default function LayoutWrapper({ children, protectedRoutes = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    setLoading(true);
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
    setLoading(false);
  }, [pathname]);

  if (loading) {
    return <Loader isLoading={true} />;
  }

  if (!username && isProtectedRoute) {
    router.replace("/login");
  }

  return children;
}