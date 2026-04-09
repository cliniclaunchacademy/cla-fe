import api from "api/ApiAxiosInstance";

export const getAdminLabs = async () => {
  return api.get("/admin/labs");
};

export const createAdminLab = async (data) => {
  return api.post("/admin/labs", data);
};

export const updateAdminLab = async ({ labId, data }) => {
  return api.put(`/admin/labs/${labId}`, data);
};

export const deleteAdminLab = async (labId) => {
  return api.delete(`/admin/labs/${labId}`);
};

export const uploadAdminLabLogo = async ({ labId, file }) => {
  const form = new FormData();
  form.append("logo", file);
  return api.post(`/admin/labs/${labId}/logo`, form);
};

export const reorderAdminLabs = async (order) => {
  return api.patch("/admin/labs/reorder", { order });
};
