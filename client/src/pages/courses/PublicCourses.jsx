import React, { useEffect, useState } from "react";
import { courseService } from "../../api/services/courses.js";
import toast from "react-hot-toast";
import { FaClone, FaEye, FaSearch, FaUser } from "react-icons/fa";
import { MdPublic } from "react-icons/md";
import { Link } from "react-router-dom";

const PublicCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPublicCourses();
  }, [page, search]);

  const fetchPublicCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getPublicCourses(page, 10, search);
      setCourses(response.data.data.courses);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      toast.error("Failed to load public courses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (courseId) => {
    try {
      await courseService.clonePublicCourse(courseId);
      toast.success("Course cloned successfully! Check your dashboard.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clone course");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPublicCourses();
  };

  if (loading && page === 1) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium" style={{ color: "#6b7280" }}>
            Loading public courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 lg:p-8 min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <MdPublic
              className="inline-block mr-3"
              style={{ color: "#2563eb" }}
            />
            Browse Public Courses
          </h1>
          <p className="text-sm md:text-base" style={{ color: "#6b7280" }}>
            Discover and clone courses shared by the community
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: "#9ca3af" }}
              >
                <FaSearch className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                style={{ background: "white", color: "#1f2937" }}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
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
              <FaSearch className="w-4 h-4" />
              Search
            </button>
          </div>
        </form>

        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : courses.length === 0 ? (
          <div
            className="bg-white rounded-xl shadow-lg p-12 text-center animate-fadeIn"
            style={{ border: "1px solid #e5e7eb" }}
          >
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              }}
            >
              <MdPublic className="w-10 h-10" style={{ color: "#3b82f6" }} />
            </div>
            <h3
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: "#374151" }}
            >
              No public courses found
            </h3>
            <p className="text-sm md:text-base" style={{ color: "#6b7280" }}>
              Try adjusting your search or check back later
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-lg p-5 md:p-6 transition-all duration-300 hover:shadow-2xl"
                  style={{ border: "1px solid #e5e7eb" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg md:text-xl font-bold flex-1 line-clamp-2"
                      style={{ color: "#1f2937" }}
                    >
                      {course.title}
                    </h3>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ml-2 shrink-0"
                      style={{ background: "#d1fae5", color: "#065f46" }}
                    >
                      <MdPublic className="w-3 h-3" />
                    </span>
                  </div>

                  <p
                    className="text-sm md:text-base line-clamp-2 mb-4"
                    style={{ color: "#6b7280" }}
                  >
                    {course.description}
                  </p>

                  <div
                    className="flex items-center gap-3 md:gap-4 text-xs md:text-sm mb-3"
                    style={{ color: "#9ca3af" }}
                  >
                    <span className="flex items-center gap-1.5">
                      <FaEye className="w-3 h-3 md:w-4 md:h-4" />
                      {course.viewCount || 0}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaClone className="w-3 h-3 md:w-4 md:h-4" />
                      {course.cloneCount || 0}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2 text-xs md:text-sm mb-4 pb-4 border-b"
                    style={{ color: "#6b7280", borderColor: "#e5e7eb" }}
                  >
                    <FaUser className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-medium">
                      {course.creator?.username || "Unknown"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/public-courses/${course._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 shadow hover:shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                        color: "white",
                      }}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleClone(course._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 shadow hover:shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                      }}
                    >
                      <FaClone className="w-3 h-3" />
                      Clone
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    color: "white",
                  }}
                >
                  Previous
                </button>
                <span
                  className="text-sm md:text-base font-semibold"
                  style={{ color: "#374151" }}
                >
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    color: "white",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicCourses;
