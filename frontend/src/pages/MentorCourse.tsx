import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface Chapter {
  id: string;
  title: string;
  content: string;
  sequence_order: number;
}

const MentorCourse = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchChapters = async () => {
    const res = await api.get(`/chapters/${courseId}`);
    setChapters(res.data);
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const addChapter = async () => {
    if (!title || !content) return alert("All fields required");

    await api.post(`/chapters/${courseId}`, {
      title,
      content,
    });

    setTitle("");
    setContent("");
    fetchChapters();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Chapters</h2>

      {/* Add Chapter */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Chapter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Chapter content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button onClick={addChapter}>Add Chapter</button>
      </div>

      {/* Chapter List */}
      <ol>
        {chapters.map((c) => (
          <li key={c.id}>
            <strong>{c.sequence_order}. {c.title}</strong>
            <p>{c.content}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default MentorCourse;
