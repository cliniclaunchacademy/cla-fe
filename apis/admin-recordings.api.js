import api from "api/ApiAxiosInstance";

// ─── Categories ───────────────────────────────────────────────────────────────

export const getAdminRecordingCategories = () => api.get("/admin/recordings");

export const createAdminCategory = (data) =>
  api.post("/admin/recordings/categories", data);

export const updateAdminCategory = ({ categoryId, data }) =>
  api.put(`/admin/recordings/categories/${categoryId}`, data);

export const deleteAdminCategory = (categoryId) =>
  api.delete(`/admin/recordings/categories/${categoryId}`);

export const reorderAdminCategories = (order) =>
  api.patch("/admin/recordings/categories/reorder", { order });

// ─── Recordings ───────────────────────────────────────────────────────────────

export const getCategoryRecordings = (categoryId) =>
  api.get(`/admin/recordings/categories/${categoryId}/recordings`);

export const createAdminRecording = ({ categoryId, data }) =>
  api.post(`/admin/recordings/categories/${categoryId}/recordings`, data);

export const updateAdminRecording = ({ recordingId, data }) =>
  api.put(`/admin/recordings/${recordingId}`, data);

export const deleteAdminRecording = (recordingId) =>
  api.delete(`/admin/recordings/${recordingId}`);

export const reorderAdminRecordings = ({ categoryId, order }) =>
  api.patch(`/admin/recordings/categories/${categoryId}/recordings/reorder`, { order });
