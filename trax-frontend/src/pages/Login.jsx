import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { username, password });
      const token = res.data.token;

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      const role = decoded.role;

      localStorage.setItem("role", role);
      navigate(`/${role}`);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          TRAX Login
        </h2>

        <label className="block text-left text-gray-700 font-medium mb-1">Username</label>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />


        <label className="block text-left text-gray-700 font-medium mb-1">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 mb-6 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow"
        >
          Login
        </button>


        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
