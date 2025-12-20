import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMentorCourses } from "../api/mentor";


interface Course {
  id: string;
  title: string;
  description: string;
}

const MentorCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMentorCourses().then(res => setCourses(res.data));
  }, []);

  return (
    <>
      <h3>My Courses</h3>

      {courses.length === 0 && <p>No courses yet</p>}

      <ul>
        {courses.map(course => (
          <li
            key={course.id}
            style={{ cursor: "pointer", marginBottom: "10px" }}
            onClick={() => navigate(`/mentor/courses/${course.id}`)}
          >
            <strong>{course.title}</strong>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MentorCourses;
