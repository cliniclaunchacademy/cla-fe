import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Add a request interceptor to automatically set the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → handle 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Maintenance mode — redirect students to /maintenance
    if (error.response?.status === 503) {
      const currentRoute = window.location.pathname;
      if (!currentRoute.startsWith("/admin") && !currentRoute.startsWith("/maintenance")) {
        const msg = error.response?.data?.message || "";
        if (msg) sessionStorage.setItem("maintenanceMessage", msg);
        window.location.href = "/maintenance";
      }
      return Promise.reject(error);
    }

    const hasToken = !!localStorage.getItem("accessToken");
    if (hasToken && (error.response?.status === 401 || error.response?.status === 403)) {
      // Token expired or invalid → clear token and redirect
      localStorage.removeItem("accessToken");

      // Dispatch a custom event so ToastProvider can show the toast
      window.dispatchEvent(new CustomEvent("app:toast", {
        detail: {
          type: "error",
          title: "Session expired",
          message: error?.response?.data?.message || "Please log in again.",
        },
      }));

      // Redirect after a short delay
      setTimeout(() => {
        const currentRoute = window.location.pathname;
        if (currentRoute.startsWith("/login")) {
          return;
        }
        window.location.href = "/login";
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default api;
