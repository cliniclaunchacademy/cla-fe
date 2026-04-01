import api from "api/ApiAxiosInstance";

export const getStudentDashboardStats = async () => {
  return api.get("/student/dashboard/stats");
};

export const getContinueLearning = async () => {
  return api.get("/student/dashboard/continue-learning");
};

export const getDashboardBanners = async () => {
  return api.get("/student/dashboard/banners");
};

export const getCommunityBanner = async () => {
  return api.get("/student/dashboard/community-banner");
};

export const getRecentActivity = async () => {
  return api.get("/student/dashboard/recent-activity");
};
