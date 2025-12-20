import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const CourseChapters = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    api.get(`/chapters/${courseId}`).then((res) => {
      setChapters(res.data);
    });
  }, [courseId]);

  const addChapter = async () => {
    const res = await api.post(`/chapters/${courseId}`, {
      title,
      content,
    });
    setChapters([...chapters, res.data]);
    setTitle("");
    setContent("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chapters</h2>

      <input
        placeholder="Chapter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={addChapter}>Add Chapter</button>

      <ul>
        {chapters.map((c) => (
          <li key={c.id}>
            <strong>{c.title}</strong>
            <p>{c.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseChapters;
