import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const createCourse = async () => {
    await api.post("/courses", { title, description });
    navigate("/mentor/courses");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Course</h2>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={createCourse}>Create</button>
    </div>
  );
};

export default CreateCourse;
