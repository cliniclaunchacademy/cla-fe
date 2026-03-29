import api from "./ApiAxiosInstance";

export const login = async (data) => {
  const { email, password } = data;
  return api.post("/users/login", { email, password });
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
};

export const getAllUsers = async ({ queryKey }) => {
  const [_key, { page, limit, search, sortBy, order }] = queryKey;

  const url = `users?page=${page}&limit=${limit}&search=${encodeURIComponent(
    search
  )}&sortBy=${sortBy}&order=${order}`;

  return api.get(url);
};

export const deleteUser = async (id) => {
  return api.delete(`/users/${id}`);
};

export const createUser = async (payload) => {
  return api.post("/users/register", payload);
};

export const updateUser = async ({id, payload}) => {
  console.log("API Payload:", id, payload);
  return api.put(`users/update-user/${id}`, payload);
};

export const createAdmin = async (payload) => {
  return api.post("/users/admin-register", payload);
};

export const getUserById = async ({ queryKey }) => {
  const [_key, { id }] = queryKey;

  const url = `/users/${id}`;

  return api.get(url, null);
};

export const getUserDetails = async () => {
  const url = `/users/userDetails`;

  return api.get(url, null);
};
