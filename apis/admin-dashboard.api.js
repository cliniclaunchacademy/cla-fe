import api from "api/ApiAxiosInstance";

export const getAdminDashboardStats = async () => {
  return api.get("/admin/dashboard/stats");
};

export const getRecentlyJoined = async () => {
  return api.get("/admin/dashboard/recently-joined");
};

export const getNotificationHistory = async ({ page = 1, limit = 20 } = {}) => {
  return api.get("/admin/dashboard/notification-history", { params: { page, limit } });
};
