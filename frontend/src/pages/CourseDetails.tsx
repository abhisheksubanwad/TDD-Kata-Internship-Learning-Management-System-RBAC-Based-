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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await api.get(`/chapters/${courseId}`);
        setChapters(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load chapters");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [courseId]);

  if (loading) return <p>Loading chapters...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Course Content</h2>

      {chapters.length === 0 ? (
        <p>No chapters yet.</p>
      ) : (
        chapters.map((ch, index) => (
          <div
            key={ch.id}
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          >
            <h4>
              {index + 1}. {ch.title}
            </h4>
            <p>{ch.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseDetails;
