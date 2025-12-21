import { useEffect, useState } from "react";
import api from "../api/axios";

interface Course {
  id: string;
  title: string;
}

interface Student {
  id: string;
  name: string;
}

const AssignCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courseId, setCourseId] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    api.get("/mentor/courses").then(res => setCourses(res.data));
    api.get("/admin/students").then(res => setStudents(res.data));
  }, []);

  const assign = async () => {
    await api.post("/enrollments/assign", {
      courseId,
      studentId,
    });

    alert("Course assigned");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assign Course</h2>

      <select onChange={e => setCourseId(e.target.value)}>
        <option>Select Course</option>
        {courses.map(c => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      <select onChange={e => setStudentId(e.target.value)}>
        <option>Select Student</option>
        {students.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <button onClick={assign}>Assign</button>
    </div>
  );
};

export default AssignCourse;
