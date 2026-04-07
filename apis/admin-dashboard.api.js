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

export const getWeeklySignups = async () => {
  return api.get("/admin/dashboard/weekly-signups");
};

export const getPopularCourses = async () => {
  return api.get("/admin/dashboard/popular-courses");
};

export const getActivityHeatmap = async () => {
  return api.get("/admin/dashboard/activity-heatmap");
};

export const getAtRiskLearners = async () => {
  return api.get("/admin/dashboard/at-risk-learners");
};

export const getStudentOverview = async ({ queryKey }) => {
  const [, userId] = queryKey;
  return api.get(`/admin/dashboard/users/${userId}/overview`);
};
