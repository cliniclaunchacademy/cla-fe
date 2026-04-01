import api from "api/ApiAxiosInstance";

export const getAdminUsers = async ({ page = 1, limit = 20, search = "", role = "", status = "" } = {}) => {
  return api.get("/admin/users", { params: { page, limit, search, role, status } });
};

export const createAdminUser = async (data) => {
  return api.post("/admin/users", data);
};

export const updateAdminUser = async ({ userId, data }) => {
  return api.put(`/admin/users/${userId}`, data);
};

export const banAdminUser = async (userId) => {
  return api.patch(`/admin/users/${userId}/ban`);
};

export const unbanAdminUser = async (userId) => {
  return api.patch(`/admin/users/${userId}/unban`);
};

export const resendWelcomeEmail = async (userId) => {
  return api.post(`/admin/users/${userId}/resend-email`);
};

export const deleteAdminUser = async (userId) => {
  return api.delete(`/admin/users/${userId}`);
};
