import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa";

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
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      }}
      className="text-white shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg md:text-xl font-bold hover-scale flex-shrink-0"
          >
            <FaGraduationCap
              className="w-6 h-6 md:w-8 md:h-8"
              style={{ color: "#3b82f6" }}
            />
            <span
              className="gradient-text"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FreeSkill
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-400 transition text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  to="/questions"
                  className="hover:text-blue-400 transition text-sm"
                >
                  Community
                </Link>
                <Link
                  to="/public-courses"
                  className="hover:text-blue-400 transition text-sm"
                >
                  Browse
                </Link>
                <Link
                  to="/bookmarks"
                  className="hover:text-blue-400 transition text-sm"
                >
                  Bookmarks
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-blue-400 transition text-sm"
                >
                  Profile
                </Link>
                <NotificationBell />
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-xs"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/public-courses"
                  className="hover:text-blue-400 transition text-sm"
                >
                  Browse Courses
                </Link>
                <Link to="/login" className="btn btn-primary text-xs">
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
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
                  className="hover:bg-gray-700 px-4 py-2 rounded transition text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  to="/questions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-700 px-4 py-2 rounded transition text-sm"
                >
                  Community
                </Link>
                <Link
                  to="/public-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-700 px-4 py-2 rounded transition text-sm"
                >
                  Browse
                </Link>
                <Link
                  to="/bookmarks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-700 px-4 py-2 rounded transition text-sm"
                >
                  Bookmarks
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-700 px-4 py-2 rounded transition text-sm"
                >
                  Notifications
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-700 px-4 py-2 rounded transition text-sm"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-xs w-full mt-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/public-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-700 px-4 py-2 rounded transition text-sm"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary text-xs"
                >
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
