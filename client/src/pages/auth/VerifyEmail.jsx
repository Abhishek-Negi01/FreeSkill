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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {status === "verifying" && (
          <>
            <FaSpinner className="text-blue-600 text-5xl mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-4">Verifying Email...</h2>
            <p className="text-gray-600">Please wait</p>
          </>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              {message}
            </h2>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle className="text-red-600 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
