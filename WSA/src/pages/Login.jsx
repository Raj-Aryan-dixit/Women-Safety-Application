import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/profile");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-300 p-6">
      <div className="bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-xl w-full max-w-md transform transition-all duration-500 hover:shadow-2xl">
        <h2 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center tracking-tight">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 text-gray-800 transition-all duration-300 group-hover:border-indigo-400"
              required
            />
            <span className="absolute -top-2 left-3 px-2 text-xs text-indigo-600 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Email
            </span>
          </div>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 text-gray-800 transition-all duration-300 group-hover:border-indigo-400"
              required
            />
            <span className="absolute -top-2 left-3 px-2 text-xs text-indigo-600 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Password
            </span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            >
              {showPassword ? (
                <FaEyeSlash className="text-xl" />
              ) : (
                <FaEye className="text-xl" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-xl font-semibold shadow-md hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
