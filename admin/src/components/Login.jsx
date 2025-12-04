/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FaLock, FaUserShield } from "react-icons/fa";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/food/admin`, { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        toast.success("✅ " + res.data.message);
      } else {
        toast.error("❌ " + res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl px-10 py-8 w-full max-w-md text-white">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-white/20 p-4 rounded-full">
            <FaUserShield className="text-4xl text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold mb-2 text-center">Admin Login</h1>
        <p className="text-gray-300 text-center mb-6 text-sm">
          Secure access to the restaurant dashboard
        </p>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-200">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="admin@example.com"
              className="mt-2 w-full bg-white/20 text-white border border-white/30 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter password"
              className="mt-2 w-full bg-white/20 text-white border border-white/30 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-semibold transition disabled:opacity-70"
          >
            <FaLock className="text-white" />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
