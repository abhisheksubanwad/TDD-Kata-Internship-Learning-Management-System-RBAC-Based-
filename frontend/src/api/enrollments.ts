import api from "./axios";

export const getMyCourses = async () => {
  const res = await api.get("/enrollments/my-courses");
  return res.data;
};
