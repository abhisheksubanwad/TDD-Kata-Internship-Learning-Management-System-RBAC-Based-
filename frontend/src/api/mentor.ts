import api from "./axios";

export const getMentorCourses = () =>
  api.get("/courses/mentor");

export const getCourseChapters = (courseId: string) =>
  api.get(`/chapters/${courseId}`);

export const addChapter = (
  courseId: string,
  title: string,
  content: string
) =>
  api.post(`/chapters/${courseId}`, { title, content });
