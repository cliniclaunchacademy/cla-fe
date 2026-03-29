import api from "./ApiAxiosInstance";

export const deleteSection = async (id) => {
  const response = await api.delete(`sections/${id}`);
  return response.data;
};

export const createSection = async (payload) => {
  return api.post("sections", payload);
};

export const updateSection = async ({ id, payload }) => {
  console.log("API Call - Update Section:", id, payload);
  return api.put(`sections/${id}`, payload);
};
