import axios from "axios";
import Swal from "sweetalert2";

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
    if (error.response?.status === (401 || 403)) {
      // Token expired or invalid → clear token and redirect
      localStorage.removeItem("accessToken");

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Something went wrong. Please log in again.",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });

      // Redirect after the toast duration
      setTimeout(() => {
        const currentRoute = window.location.pathname;
        console.log("111111111111", currentRoute);
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
