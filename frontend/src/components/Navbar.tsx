import { useNavigate } from "react-router-dom";
import { getRole, logout } from "../utils/auth";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const role = getRole();

  return (
    <div className="navbar">
      {/* Left side */}
      <div className="navbar-title" onClick={() => navigate("/")}>
        LMS Dashboard
      </div>

      {/* Right side links */}
      <div className="navbar-links">
        {role === "student" && (
          <>
            <button onClick={() => navigate("/student")}>Dashboard</button>
            <button onClick={() => navigate("/my-courses")}>My Courses</button>
          </>
        )}

        {role === "mentor" && (
          <>
            <button onClick={() => navigate("/mentor")}>Dashboard</button>
            <button onClick={() => navigate("/mentor/courses")}>
              My Courses
            </button>
          </>
        )}

        {role === "admin" && (
          <button onClick={() => navigate("/admin")}>Admin Panel</button>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
