import api from "api/ApiAxiosInstance";

export const getAdminResources = async () => api.get("/admin/resources");

export const getAdminResourcesByCourse = async (courseId) =>
  api.get(`/admin/resources/${courseId}`);

export const addLessonResource = async ({ lessonId, data, file }) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", data.title);
    formData.append("type", data.type);
    if (data.description) formData.append("description", data.description);
    formData.append("status", data.status);
    return api.post(`/admin/lessons/${lessonId}/resources`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post(`/admin/lessons/${lessonId}/resources`, data);
};

export const updateLessonResource = async ({ lessonId, resourceId, data, file }) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    if (data.title) formData.append("title", data.title);
    if (data.type) formData.append("type", data.type);
    if (data.description) formData.append("description", data.description);
    if (data.status) formData.append("status", data.status);
    return api.put(`/admin/lessons/${lessonId}/resources/${resourceId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.put(`/admin/lessons/${lessonId}/resources/${resourceId}`, data);
};

export const deleteLessonResource = async ({ lessonId, resourceId }) =>
  api.delete(`/admin/lessons/${lessonId}/resources/${resourceId}`);

export const reorderLessonResources = async ({ lessonId, order }) =>
  api.patch(`/admin/lessons/${lessonId}/resources/reorder`, { order });
