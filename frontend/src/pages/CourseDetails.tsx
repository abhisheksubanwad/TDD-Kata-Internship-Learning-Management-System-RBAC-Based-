import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface Chapter {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchChapters = async () => {
    const res = await api.get(`/chapters/${courseId}`);
    setChapters(res.data);
    setLoading(false);
  };

  const fetchProgress = async () => {
    const res = await api.get(`/progress/course/${courseId}`);
    setProgress(res.data.progress);
    setIsCompleted(res.data.isCompleted);
  };

  useEffect(() => {
    fetchChapters();
    fetchProgress();
  }, [courseId]);

  const markCompleted = async (chapterId: string) => {
    await api.post(`/progress/${chapterId}`);
    await fetchChapters();
    await fetchProgress();
  };

  if (loading) return <p>Loading chapters...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Course Content</h2>

      {/* ✅ PROGRESS BAR — ADD HERE */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Progress: {progress}%</h3>

        <div
          style={{
            height: "10px",
            background: "#e5e7eb",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#22c55e",
              borderRadius: "5px",
            }}
          />
        </div>

        {isCompleted && (
          <p style={{ color: "green", marginTop: "10px" }}>
            🎉 Course Completed!
          </p>
        )}
      </div>

      {isCompleted && (
  <button
    onClick={() =>
      window.open(
        `${import.meta.env.VITE_API_URL}/certificates/${courseId}`,
        "_blank"
      )
    }
    style={{
      marginTop: "15px",
      padding: "8px 16px",
      backgroundColor: "#16a34a",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    🎓 Download Certificate
  </button>
)}


      {chapters.map((ch, index) => (
        <div
          key={ch.id}
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            backgroundColor: ch.isCompleted
              ? "#ecfdf5"
              : ch.isUnlocked
              ? "#ffffff"
              : "#f3f4f6",
            opacity: ch.isUnlocked ? 1 : 0.6,
          }}
        >
          <h4>
            {index + 1}. {ch.title}
            {ch.isCompleted && " ✅"}
            {!ch.isUnlocked && " 🔒"}
          </h4>

          {ch.isUnlocked && <p>{ch.content}</p>}

          {ch.isUnlocked && !ch.isCompleted && (
            <button
              onClick={() => markCompleted(ch.id)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Mark as Completed
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseDetails;
