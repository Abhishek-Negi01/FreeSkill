import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/verify-email?token=${token}`,
        );
        setStatus("success");
        setMessage("Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(error?.response?.data?.message || "Failed to verify email");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md text-center animate-scaleIn"
        style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}
      >
        {status === "verifying" && (
          <>
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              }}
            >
              <FaSpinner
                className="w-10 h-10 animate-spin"
                style={{ color: "#3b82f6" }}
              />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "#1f2937" }}
            >
              Verifying Email...
            </h2>
            <p className="text-sm md:text-base" style={{ color: "#6b7280" }}>
              Please wait while we verify your email address
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center animate-bounce"
              style={{
                background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
              }}
            >
              <FaCheckCircle
                className="w-10 h-10"
                style={{ color: "#10b981" }}
              />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "#10b981" }}
            >
              {message}
            </h2>
            <p
              className="text-sm md:text-base mb-6"
              style={{ color: "#6b7280" }}
            >
              You can now login to your account and start learning
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl w-full"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              }}
            >
              <FaTimesCircle
                className="w-10 h-10"
                style={{ color: "#ef4444" }}
              />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "#ef4444" }}
            >
              Verification Failed
            </h2>
            <p
              className="text-sm md:text-base mb-6"
              style={{ color: "#6b7280" }}
            >
              {message}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl w-full"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
