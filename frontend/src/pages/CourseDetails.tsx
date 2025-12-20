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
  const [loading, setLoading] = useState(true);

  const fetchChapters = async () => {
    const res = await api.get(`/chapters/${courseId}`);
    setChapters(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchChapters();
  }, [courseId]);

  const markCompleted = async (chapterId: string) => {
    await api.post(`/chapters/complete/${chapterId}`);
    fetchChapters(); // refresh lock state
  };

  if (loading) return <p>Loading chapters...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Course Content</h2>

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
