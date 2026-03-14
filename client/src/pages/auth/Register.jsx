import { useContext, useState } from "react";
import React from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ fullname, username, email, password });
      toast.success(
        "Registration successful! Please check your email to verify your account.",
      );
      navigate("/login", {
        state: {
          message:
            "Check your email and Please verify your email before logging in.",
        },
      });
    } catch (error) {
      const errorMsg = "Please Retry Registration failed";
      setError(errorMsg);
      toast.error(errorMsg);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 w-full max-w-md animate-fadeIn"
        style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}
      >
        <div className="text-center mb-8">
          <h2
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Join FreeSkill
          </h2>
          <p className="text-sm md:text-base" style={{ color: "#6b7280" }}>
            Create your account and start learning
          </p>
        </div>

        {error && (
          <div
            className="p-4 rounded-lg mb-6 animate-slideDown"
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
            }}
          >
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block font-semibold mb-2 text-sm"
              style={{ color: "#374151" }}
            >
              Full Name
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: "#9ca3af" }}
              >
                <FaUser className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="John Doe"
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
            </div>
          </div>

          <div>
            <label
              className="block font-semibold mb-2 text-sm"
              style={{ color: "#374151" }}
            >
              Username
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: "#9ca3af" }}
              >
                <FaUser className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="johndoe"
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
            </div>
          </div>

          <div>
            <label
              className="block font-semibold mb-2 text-sm"
              style={{ color: "#374151" }}
            >
              Email Address
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: "#9ca3af" }}
              >
                <FaEnvelope className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="your@email.com"
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
            </div>
          </div>

          <div>
            <label
              className="block font-semibold mb-2 text-sm"
              style={{ color: "#374151" }}
            >
              Password
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: "#9ca3af" }}
              >
                <FaLock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
              Minimum 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl mt-6"
            style={{
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "white",
              transform: loading ? "none" : "translateY(0)",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? (
              <>
                <div
                  className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"
                  style={{ borderWidth: "3px" }}
                ></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <FaUserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline transition"
              style={{ color: "#3b82f6" }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
