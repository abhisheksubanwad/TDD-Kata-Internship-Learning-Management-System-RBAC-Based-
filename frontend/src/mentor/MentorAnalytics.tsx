import { useEffect, useState } from "react";
import api from "../api/axios";

interface Analytics {
  courseTitle: string;
  studentName: string;
  completedChapters: number;
  totalChapters: number;
  progress: number;
  isCompleted: boolean;
}

const MentorAnalytics = () => {
  const [data, setData] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/mentor/analytics")
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Progress</h2>

      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        data.map((a, i) => (
          <div
            key={i}
            style={{
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          >
            <h4>{a.courseTitle}</h4>
            <p>Student: {a.studentName}</p>
            <p>
              Progress: {a.completedChapters}/{a.totalChapters} (
              {a.progress}%)
            </p>

            <div
              style={{
                height: "8px",
                background: "#e5e7eb",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  width: `${a.progress}%`,
                  height: "100%",
                  background: a.isCompleted ? "#22c55e" : "#3b82f6",
                  borderRadius: "4px",
                }}
              />
            </div>

            {a.isCompleted && (
              <p style={{ color: "green", marginTop: "8px" }}>
                ✅ Course Completed
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MentorAnalytics;
