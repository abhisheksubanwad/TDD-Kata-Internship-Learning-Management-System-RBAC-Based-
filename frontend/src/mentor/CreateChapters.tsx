import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface Chapter {
  id: string;
  title: string;
  sequence_order: number;
}

const CreateChapters = () => {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const fetchChapters = async () => {
    const res = await api.get(`/chapters/${courseId}`);
    setChapters(res.data);
  };

  const addChapter = async () => {
    await api.post(`/chapters/${courseId}`, { title, content });
    setTitle("");
    setContent("");
    fetchChapters();
  };

  useEffect(() => {
    fetchChapters();
  }, []);

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
            {c.sequence_order}. {c.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateChapters;
