import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { HiMenu, HiX } from "react-icons/hi";
import {
  FaGraduationCap,
  FaTh,
  FaUsers,
  FaBookmark,
  FaUser,
  FaSignOutAlt,
  FaGlobe,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className="text-white shadow-2xl sticky top-0 z-50"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        borderBottom: "2px solid rgba(59, 130, 246, 0.3)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Enhanced */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="relative p-2.5 md:p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                boxShadow:
                  "0 8px 25px rgba(59, 130, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)",
              }}
            >
              <FaGraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" />
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="text-2xl md:text-3xl font-black tracking-tight leading-none"
                style={{
                  background:
                    "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #c084fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 2px 8px rgba(96, 165, 250, 0.4))",
                }}
              >
                FreeSkill
              </span>
              <span className="text-xs font-medium tracking-wider opacity-70">
                Learn Smarter
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg"
                >
                  <FaTh className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/questions"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg"
                >
                  <FaUsers className="w-4 h-4" />
                  <span>Community</span>
                </Link>
                <Link
                  to="/public-courses"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg"
                >
                  <FaGlobe className="w-4 h-4" />
                  <span>Browse</span>
                </Link>
                <Link
                  to="/bookmarks"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg"
                >
                  <FaBookmark className="w-4 h-4" />
                  <span>Bookmarks</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg"
                >
                  <FaUser className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <div className="ml-2">
                  <NotificationBell />
                </div>

                {/* Enhanced Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ml-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
                  }}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/public-courses"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  <FaGlobe className="w-4 h-4" />
                  <span>Browse Courses</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ml-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  <FaUser className="w-4 h-4" />
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6 md:w-7 md:h-7" />
            ) : (
              <HiMenu className="w-6 h-6 md:w-7 md:h-7" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-slideDown">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-xl transition-all text-sm font-semibold"
                >
                  <FaTh className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/questions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-xl transition-all text-sm font-semibold"
                >
                  <FaUsers className="w-4 h-4" />
                  Community
                </Link>
                <Link
                  to="/public-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-xl transition-all text-sm font-semibold"
                >
                  <FaGlobe className="w-4 h-4" />
                  Browse
                </Link>
                <Link
                  to="/bookmarks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-xl transition-all text-sm font-semibold"
                >
                  <FaBookmark className="w-4 h-4" />
                  Bookmarks
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-xl transition-all text-sm font-semibold"
                >
                  <FaUser className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl mt-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
                  }}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/public-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-xl transition-all text-sm font-semibold"
                >
                  <FaGlobe className="w-4 h-4" />
                  Browse Courses
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  <FaUser className="w-4 h-4" />
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
