import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaLock,
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [username, setUsername] = useState(user?.username || "");

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully! (API isn't implemented yet)");
    setEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true },
      );
      toast.success("Password changed successfully!");
      setChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 md:p-6 lg:p-8 min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Section */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fadeIn"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                My Profile
              </h1>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                Manage your account information
              </p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              style={{
                background: editing
                  ? "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                  : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {editing ? (
                <>
                  <FaTimes className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <FaEdit className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-5">
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
                    required
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
                    required
                    style={{ background: "white", color: "#1f2937" }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block font-semibold mb-2 text-sm"
                  style={{ color: "#374151" }}
                >
                  Email
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
                    value={user?.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 text-sm"
                    style={{
                      background: "#f3f4f6",
                      cursor: "not-allowed",
                      color: "#6b7280",
                    }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                  Email cannot be changed
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <FaSave className="w-4 h-4" />
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div
                className="p-4 rounded-lg"
                style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
              >
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "#6b7280" }}
                >
                  FULL NAME
                </label>
                <p
                  className="text-base md:text-lg font-semibold"
                  style={{ color: "#1f2937" }}
                >
                  {user?.fullname}
                </p>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
              >
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "#6b7280" }}
                >
                  USERNAME
                </label>
                <p
                  className="text-base md:text-lg font-semibold"
                  style={{ color: "#1f2937" }}
                >
                  {user?.username}
                </p>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
              >
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "#6b7280" }}
                >
                  EMAIL
                </label>
                <p
                  className="text-base md:text-lg font-semibold flex items-center gap-2"
                  style={{ color: "#1f2937" }}
                >
                  <FaEnvelope style={{ color: "#6b7280" }} />
                  {user?.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fadeIn"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <h2
            className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2"
            style={{ color: "#1f2937" }}
          >
            <FaLock style={{ color: "#3b82f6" }} />
            Change Password
          </h2>

          {!changingPassword ? (
            <button
              onClick={() => setChangingPassword(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
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
              <FaLock className="w-4 h-4" />
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label
                  className="block font-semibold mb-2 text-sm"
                  style={{ color: "#374151" }}
                >
                  Current Password
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
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="••••••••"
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
                  New Password
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="••••••••"
                    required
                    minLength={6}
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
                  Confirm New Password
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={loading}
                    style={{ background: "white", color: "#1f2937" }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                  Minimum 6 characters
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  style={{
                    background: loading
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading)
                      e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading)
                      e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {loading ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Change Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChangingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <FaTimes className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
