import api from "./ApiAxiosInstance";

export const deleteLecture = async (id) => {
  const response = await api.delete(`lectures/${id}`);
  return response.data;
};

export const createLecture = async (payload) => {
  return api.post("lectures", payload);
};

export const getLectureStatus = async (lectureId) => {
  const res = await api.get(`/lectures/${lectureId}/status`);
  return res.data;
};

export const updateLecture = async ({ id, payload }) => {
  console.log("API Call - Update Section:", id, payload);
  return api.put(`lectures/${id}`, payload);
};
