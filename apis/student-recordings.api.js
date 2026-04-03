import api from "api/ApiAxiosInstance";

export const getStudentRecordings = () => api.get("/student/recordings");

export const getStudentRecording = (id) => api.get(`/student/recordings/${id}`);
