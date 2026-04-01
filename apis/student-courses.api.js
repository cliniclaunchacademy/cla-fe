import api from "api/ApiAxiosInstance";

export const getStudentCourses = async () => {
  return api.get("/student/courses");
};

export const getStudentCourseById = async ({ queryKey }) => {
  const [_key, courseId] = queryKey;
  return api.get(`/student/courses/${courseId}`);
};
