import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await api.get(`/chapters/${courseId}`);
        setChapters(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load chapters");
      }
    };

    fetchChapters();
  }, [courseId]);

  // 🔹 Fetch completed chapters
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/progress/me");
        setCompletedChapters(res.data);
      } catch (error) {
        console.error("Failed to fetch progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const markCompleted = async (chapterId: string) => {
    try {
      await api.post(`/progress/${chapterId}`);
      setCompletedChapters((prev) => [...prev, chapterId]);
    } catch {
      alert("Failed to mark chapter as completed");
    }
  };

  if (loading) return <p>Loading chapters...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Course Content</h2>

      {chapters.length === 0 ? (
        <p>No chapters yet.</p>
      ) : (
        chapters.map((ch, index) => {
          const isCompleted = completedChapters.includes(ch.id);

          return (
            <div
              key={ch.id}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                backgroundColor: isCompleted ? "#ecfdf5" : "#fff",
              }}
            >
              <h4>
                {index + 1}. {ch.title}
              </h4>

              <p>{ch.content}</p>

              <button
                disabled={isCompleted}
                onClick={() => markCompleted(ch.id)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  backgroundColor: isCompleted ? "#22c55e" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isCompleted ? "not-allowed" : "pointer",
                }}
              >
                {isCompleted ? "Completed ✅" : "Mark as Completed"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CourseDetails;
