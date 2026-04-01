import api from "api/ApiAxiosInstance";

export const getAdminProfile = async () => {
  return api.get("/admin/me");
};

export const updateAdminProfile = async (data) => {
  return api.patch("/admin/profile", data);
};

export const updateAdminPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api.post("/admin/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
