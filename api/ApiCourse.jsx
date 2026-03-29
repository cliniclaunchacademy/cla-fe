import api from "./ApiAxiosInstance";

export const getAllCourses = async ({ queryKey }) => {
  const [_key, { page, limit, search, sortBy, order, status }] = queryKey;

  let url;
  if (status) {
    url = `courses?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}&sortBy=${sortBy}&order=${order}&status=${status}`;
  } else {
    url = `courses?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}&sortBy=${sortBy}&order=${order}`;
  }

  return api.get(url);
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`courses/${id}`);
  return response.data;
};

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
