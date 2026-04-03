import api from "api/ApiAxiosInstance";

export const getAdminBanners = () => api.get("/admin/banners");

export const getActiveBanners = () => api.get("/admin/banners/active");

export const createAdminBanner = ({ label, file }) => {
  const formData = new FormData();
  formData.append("label", label);
  formData.append("image", file);
  return api.post("/admin/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// PATCH — only label and status can be updated (no image change after creation)
export const updateAdminBanner = ({ bannerId, data }) =>
  api.patch(`/admin/banners/${bannerId}`, data);

export const deleteAdminBanner = (bannerId) =>
  api.delete(`/admin/banners/${bannerId}`);

export const reorderAdminBanners = (order) =>
  api.patch("/admin/banners/reorder", { order });
