import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseChapters, addChapter } from "../api/mentor";


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

  const loadChapters = async () => {
    const res = await getCourseChapters(courseId!);
    setChapters(res.data);
  };

  useEffect(() => {
    loadChapters();
  }, []);

  const handleAdd = async () => {
    await addChapter(courseId!, title, content);
    setTitle("");
    setContent("");
    loadChapters();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Chapters</h3>

      <ul>
        {chapters.map(ch => (
          <li key={ch.id}>
            <strong>{ch.title}</strong>
            <p>{ch.content}</p>
          </li>
        ))}
      </ul>

      <hr />

      <h4>Add Chapter</h4>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <button onClick={handleAdd}>Add Chapter</button>
    </div>
  );
};

export default CourseChapters;
