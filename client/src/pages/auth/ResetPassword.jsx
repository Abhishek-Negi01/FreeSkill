import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaLock, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/reset-password`,
        {
          token,
          password,
        },
      );
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        }}
      >
        <div className="card p-8 w-full max-w-md text-center animate-scaleIn">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
            }}
          >
            <FaExclamationTriangle
              className="w-10 h-10"
              style={{ color: "#ef4444" }}
            />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: "#1f2937" }}
          >
            Invalid Link
          </h2>
          <p className="text-sm md:text-base mb-6" style={{ color: "#6b7280" }}>
            This password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password" className="btn btn-primary w-full">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      }}
    >
      <div className="card p-6 md:p-8 w-full max-w-md animate-fadeIn">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-2 gradient-text"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Reset Password
        </h2>
        <p className="text-center mb-6 text-sm" style={{ color: "#6b7280" }}>
          Enter your new password
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block font-semibold mb-2 text-sm"
              style={{ color: "#374151" }}
            >
              New Password
            </label>
            <div className="relative">
              <FaLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "#9ca3af" }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block font-semibold mb-2 text-sm"
              style={{ color: "#374151" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <FaLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "#9ca3af" }}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pl-10"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
              Minimum 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary mb-4"
          >
            {loading ? (
              <>
                <div
                  className="spinner"
                  style={{ width: "20px", height: "20px", borderWidth: "2px" }}
                ></div>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium hover:underline transition"
            style={{ color: "#3b82f6" }}
          >
            <FaArrowLeft /> Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
