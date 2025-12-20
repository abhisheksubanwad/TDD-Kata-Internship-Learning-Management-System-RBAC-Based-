import { useNavigate } from "react-router-dom";

const Mentor = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mentor Dashboard</h2>

      <button onClick={() => navigate("/mentor/courses")}>
        My Courses
      </button>

      <button
        onClick={() => navigate("/mentor/create-course")}
        style={{ marginLeft: "10px" }}
      >
        Create Course
      </button>
    </div>
  );
};

export default Mentor;
