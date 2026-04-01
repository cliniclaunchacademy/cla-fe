import api from "api/ApiAxiosInstance";

export const getStudentProfile = async () => {
  return api.get("/student/me");
};

export const updateStudentProfile = async (data) => {
  return api.patch("/student/settings/profile", data);
};

export const updateStudentPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api.post("/student/settings/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
