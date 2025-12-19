import { useNavigate } from "react-router-dom";
import { getRole, logout } from "../utils/auth";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3>LMS</h3>

      <div className="nav-links">
        {role === "student" && (
          <button onClick={() => navigate("/student")}>Dashboard</button>
        )}

        {role === "mentor" && (
          <>
            <button onClick={() => navigate("/mentor")}>Dashboard</button>
            <button onClick={() => navigate("/mentor/create-course")}>
              Create Course
            </button>
          </>
        )}

        {role === "admin" && (
          <button onClick={() => navigate("/admin")}>Admin Panel</button>
        )}

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
