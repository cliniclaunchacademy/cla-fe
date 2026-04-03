import api from "api/ApiAxiosInstance";

// ─── Courses ──────────────────────────────────────────────────────────────────

export const getAdminCourses = async () => api.get("/admin/courses");

export const getAdminCourseEditor = async (courseId) =>
  api.get(`/admin/courses/${courseId}/editor`);

export const createAdminCourse = async (data) => api.post("/admin/courses", data);

export const updateAdminCourse = async ({ courseId, data }) =>
  api.put(`/admin/courses/${courseId}`, data);

export const deleteAdminCourse = async (courseId) =>
  api.delete(`/admin/courses/${courseId}`);

export const reorderAdminCourses = async (order) =>
  api.patch("/admin/courses/reorder", { order });

export const uploadCourseThumbnail = async ({ courseId, file }) => {
  const formData = new FormData();
  formData.append("thumbnail", file);
  return api.post(`/admin/courses/${courseId}/thumbnail`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadCourseBanner = async ({ courseId, file }) => {
  const formData = new FormData();
  formData.append("banner", file);
  return api.post(`/admin/courses/${courseId}/banner`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAdminInstructors = async () => api.get("/admin/instructors");

// ─── Modules ──────────────────────────────────────────────────────────────────

export const createAdminModule = async ({ courseId, title }) =>
  api.post(`/admin/courses/${courseId}/modules`, { title });

export const updateAdminModule = async ({ courseId, moduleId, title }) =>
  api.put(`/admin/courses/${courseId}/modules/${moduleId}`, { title });

export const deleteAdminModule = async ({ courseId, moduleId }) =>
  api.delete(`/admin/courses/${courseId}/modules/${moduleId}`);

export const reorderAdminModules = async ({ courseId, order }) =>
  api.patch(`/admin/courses/${courseId}/modules/reorder`, { order });

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const createAdminLesson = async ({ courseId, moduleId, data }) =>
  api.post(`/admin/courses/${courseId}/modules/${moduleId}/lessons`, data);

export const updateAdminLesson = async ({ courseId, moduleId, lessonId, data }) =>
  api.put(`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data);

export const deleteAdminLesson = async ({ courseId, moduleId, lessonId }) =>
  api.delete(`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);

export const reorderAdminLessons = async ({ courseId, moduleId, order }) =>
  api.patch(`/admin/courses/${courseId}/modules/${moduleId}/lessons/reorder`, { order });
