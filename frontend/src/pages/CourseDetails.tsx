import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const CourseDetails = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await api.get(`/chapters/course/${courseId}`);
        setChapters(res.data);
      } catch {
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
        chapters.map((ch) => (
          <div key={ch.id} style={{ marginBottom: "15px" }}>
            <h4>{ch.title}</h4>
            <p>{ch.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseDetails;
