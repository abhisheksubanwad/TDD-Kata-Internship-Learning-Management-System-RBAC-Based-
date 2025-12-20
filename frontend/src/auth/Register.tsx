import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

type Role = "student" | "mentor" | "admin";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ROLE SELECT */}
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister}>Register</button>

        <div className="auth-footer">
          Already registered?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
