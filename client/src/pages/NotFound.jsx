import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div
      className="flex items-center justify-center p-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="text-center animate-fadeIn">
        <div className="mb-6">
          <FaExclamationTriangle
            className="w-20 h-20 md:w-24 md:h-24 mx-auto animate-bounce"
            style={{ color: "#f59e0b" }}
          />
        </div>
        <h1
          className="text-6xl md:text-8xl font-bold mb-4 gradient-text"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>
        <p className="text-xl md:text-2xl mb-2" style={{ color: "#374151" }}>
          Page Not Found
        </p>
        <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
          The page you're looking for doesn't exist
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
