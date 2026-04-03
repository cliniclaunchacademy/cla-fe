import api from "api/ApiAxiosInstance";

export const getAdminSettings = () => api.get("/admin/settings");

export const updateAdminSettings = (data) => api.put("/admin/settings", data);
