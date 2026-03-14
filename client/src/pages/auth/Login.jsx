import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const registrationMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = "Login failed";
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
            Welcome Back
          </h2>
          <p className="text-sm md:text-base" style={{ color: "#6b7280" }}>
            Login to continue your learning journey
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

        {registrationMessage && (
          <div
            className="p-3 rounded-lg mb-4 text-sm font-medium"
            style={{
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              color: "#92400e",
            }}
          >
            {registrationMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
            </div>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium hover:underline transition"
              style={{ color: "#3b82f6" }}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
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
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <FaSignInAlt className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold hover:underline transition"
              style={{ color: "#3b82f6" }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
