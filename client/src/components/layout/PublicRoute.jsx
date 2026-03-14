import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="spinner"
            style={{
              width: "48px",
              height: "48px",
              borderWidth: "4px",
              borderColor: "#3b82f6",
              borderTopColor: "transparent",
            }}
          ></div>
          <p className="mt-4 text-sm font-medium" style={{ color: "#6b7280" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
}
