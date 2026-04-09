import api from "api/ApiAxiosInstance";

export const getStudentLabs = async () => {
  return api.get("/student/labs");
};
