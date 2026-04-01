import api from "api/ApiAxiosInstance";

export const getAdminCourses = async () => {
  return api.get("/admin/courses");
};

export const createAdminCourse = async (data) => {
  return api.post("/admin/courses", data);
};

export const updateAdminCourse = async ({ courseId, data }) => {
  return api.put(`/admin/courses/${courseId}`, data);
};

export const deleteAdminCourse = async (courseId) => {
  return api.delete(`/admin/courses/${courseId}`);
};

export const reorderAdminCourses = async (order) => {
  return api.patch("/admin/courses/reorder", { order });
};

export const uploadCourseThumbnail = async ({ courseId, file }) => {
  const formData = new FormData();
  formData.append("thumbnail", file);
  return api.post(`/admin/courses/${courseId}/thumbnail`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAdminInstructors = async () => {
  return api.get("/admin/instructors");
};
