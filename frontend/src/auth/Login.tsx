import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      // CLEAR OLD SESSION FIRST
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // SAVE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // ROLE-BASED REDIRECT
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "mentor") navigate("/mentor");
      else navigate("/student");

    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <div className="auth-footer">
          New user?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
