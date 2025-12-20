import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface Chapter {
  id: string;
  title: string;
  content: string;
  sequence_order: number;
}

const CourseChapters = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await api.get(`/chapters/${courseId}`);
        setChapters(res.data);
      } catch (error) {
        console.error("Failed to load chapters", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [courseId]);

  if (loading) return <p>Loading chapters...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Course Chapters</h2>

      {chapters.length === 0 ? (
        <p>No chapters available yet.</p>
      ) : (
        <ol>
          {chapters.map((chapter) => (
            <li key={chapter.id} style={{ marginBottom: "15px" }}>
              <h4>
                {chapter.sequence_order}. {chapter.title}
              </h4>
              <p>{chapter.content}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default CourseChapters;
