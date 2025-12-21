import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface Progress {
  studentId: string;
  name: string;
  email: string;
  progress: number;
}

const MentorCourseProgress = () => {
  const { courseId } = useParams();
  const [data, setData] = useState<Progress[]>([]);

  useEffect(() => {
    api
      .get(`/mentor/courses/${courseId}/progress`)
      .then((res) => setData(res.data));
  }, [courseId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Progress</h2>

      {data.map((s) => (
        <div
          key={s.studentId}
          style={{
            border: "1px solid #e5e7eb",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "6px",
          }}
        >
          <h4>{s.name}</h4>
          <p>{s.email}</p>

          <div style={{ height: "8px", background: "#e5e7eb" }}>
            <div
              style={{
                width: `${s.progress}%`,
                height: "100%",
                background: "#22c55e",
              }}
            />
          </div>

          <p>{s.progress}% completed</p>
        </div>
      ))}
    </div>
  );
};

export default MentorCourseProgress;
