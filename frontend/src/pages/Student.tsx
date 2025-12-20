import { useEffect, useState } from "react";
import api from "../api/axios";

interface Course {
  id: string;
  title: string;
  description: string;
}

const Student = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data));
  }, []);

  const enroll = async (courseId: string) => {
    await api.post(`/enrollments/${courseId}`);
    alert("Enrolled successfully");
  };

  return (
    <div>
      <h2>Available Courses</h2>

      {courses.map((course) => (
        <div key={course.id} style={{ border: "1px solid #ccc", padding: 10 }}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <button onClick={() => enroll(course.id)}>Enroll</button>
        </div>
      ))}
    </div>
  );
};

export default Student;
