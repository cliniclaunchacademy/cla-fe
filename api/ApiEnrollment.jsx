import api from "./ApiAxiosInstance";

export const getEnrollmentsByUser = async ({ queryKey }) => {
  const [_key, { page, limit, search, sortBy, order }] = queryKey;

  const url = `enrollment/user?page=${page}&limit=${limit}&search=${encodeURIComponent(
    search
  )}&sortBy=${sortBy}&order=${order}`;

  return api.get(url);
};

// export const deleteEvent = async (id) => {
//   const response = await api.delete(`events/${id}`);
//   return response.data;
// };

export const createCourse = async (payload) => {
  return api.post("courses", payload);
};

export const getCourseById = async ({ queryKey }) => {
  const [_key, { id }] = queryKey;
  const url = `courses/${id}`;

  return api.get(url);
};

export const updateCourse = async ({ id, payload }) => {
  console.log("API Call - Update Course:", id, payload);
  return api.put(`courses/${id}`, payload);
};
