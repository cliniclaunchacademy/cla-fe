import api from "api/ApiAxiosInstance";

export const getAdminInstructors = () => api.get("/admin/instructors");

export const createAdminInstructor = (data) => api.post("/admin/instructors", data);

export const updateAdminInstructor = ({ instructorId, data }) =>
  api.put(`/admin/instructors/${instructorId}`, data);

export const uploadInstructorPhoto = ({ instructorId, file }) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api.post(`/admin/instructors/${instructorId}/photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteAdminInstructor = (instructorId) =>
  api.delete(`/admin/instructors/${instructorId}`);
