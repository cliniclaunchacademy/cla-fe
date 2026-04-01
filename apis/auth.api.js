import api from "api/ApiAxiosInstance";

export const login = async (data) => {
  const { email, password } = data;
  return api.post("/auth/login", { email, password });
};

export const forgotPassword = async (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = async ({ token, password, confirmPassword }) => {
  return api.post("/auth/reset-password", { token, password, confirmPassword });
};
