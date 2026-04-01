import api from "api/ApiAxiosInstance";

export const getStudentCourses = async () => {
  return api.get("/student/courses");
};

export const getStudentCourseById = async ({ queryKey }) => {
  const [_key, courseId] = queryKey;
  return api.get(`/student/courses/${courseId}`);
};

export const getStudentLesson = async ({ queryKey }) => {
  const [_key, courseId, lessonId] = queryKey;
  return api.get(`/student/courses/${courseId}/lessons/${lessonId}`);
};

export const markLessonComplete = async ({ courseId, lessonId }) => {
  return api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
};

export const unmarkLessonComplete = async ({ courseId, lessonId }) => {
  return api.delete(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
};

export const flagLessonVideo = async ({ courseId, lessonId }) => {
  return api.post(`/student/courses/${courseId}/lessons/${lessonId}/flag-video`);
};
