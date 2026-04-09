import api from "api/ApiAxiosInstance";

export const getAdminLabApplications = async ({ page = 1, limit = 50, search = "", status = "" } = {}) => {
  return api.get("/admin/lab-applications", { params: { page, limit, search, status } });
};

export const getAdminLabApplicationById = async (id) => {
  return api.get(`/admin/lab-applications/${id}`);
};

export const updateAdminLabApplicationStatus = async ({ id, status, rejectionReason }) => {
  return api.patch(`/admin/lab-applications/${id}/status`, { status, rejectionReason });
};
