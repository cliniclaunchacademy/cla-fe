import api from "api/ApiAxiosInstance";

export const getStudentNotifications = () => api.get("/student/notifications");

export const markAllNotificationsRead = () => api.patch("/student/notifications/read-all");

export const markNotificationRead = (notificationId) =>
  api.patch(`/student/notifications/${notificationId}/read`);
