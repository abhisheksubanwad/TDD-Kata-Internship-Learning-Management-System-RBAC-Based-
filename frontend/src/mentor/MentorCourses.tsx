import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Course {
  id: string;
  title: string;
  description: string;
}

const MentorCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/courses/mentor").then((res) => {
      setCourses(res.data);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Courses</h2>

      {courses.length === 0 ? (
        <p>No courses yet</p>
      ) : (
        <ul>
          {courses.map((c) => (
            <li
              key={c.id}
              style={{ cursor: "pointer", marginBottom: "10px" }}
              onClick={() => navigate(`/mentor/courses/${c.id}`)}
            >
              <strong>{c.title}</strong>
              <p>{c.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MentorCourses;
