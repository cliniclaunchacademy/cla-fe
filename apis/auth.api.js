import api from "api/ApiAxiosInstance";

export const login = async (data) => {
  const { email, password } = data;
  return api.post("/auth/login", { email, password });
};
