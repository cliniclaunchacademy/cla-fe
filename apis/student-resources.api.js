import api from "api/ApiAxiosInstance";

export const getStudentResources = async () => {
  return api.get("/student/resources");
};
