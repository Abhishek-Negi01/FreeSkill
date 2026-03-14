import React, { useEffect, useState } from "react";
import { courseService } from "../../api/services/courses.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaSearch,
  FaGlobe,
  FaLock,
  FaEdit,
  FaTrash,
  FaBook,
} from "react-icons/fa";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchingCourses, setFetchingCourses] = useState(true);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const createCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await courseService.create({
        title: courseTitle,
        description: courseDescription,
      });
      setCourses([...courses, res.data.data.course]);
      setCourseTitle("");
      setCourseDescription("");
      setShowForm(false);
      toast.success(res?.data?.message || "Course created successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await courseService.update(editingCourse._id, {
        title: courseTitle,
        description: courseDescription,
      });
      setCourses(
        courses.map((c) =>
          c._id === editingCourse._id ? res.data.data.course : c,
        ),
      );
      setCourseTitle("");
      setCourseDescription("");
      setEditingCourse(null);
      setShowForm(false);
      toast.success(res?.data?.message || "Course updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm("Delete this course? All videos will be lost.")) return;
    try {
      const res = await courseService.delete(courseId);
      setCourses(courses.filter((c) => c._id !== courseId));
      toast.success(res?.data?.message || "Course deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course");
    }
  };

  const startEdit = (course, e) => {
    e.preventDefault();
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setCourseTitle("");
    setCourseDescription("");
  };

  const togglePublic = async (courseId, currentStatus) => {
    try {
      const res = await courseService.togglePublic(courseId);
      setCourses(
        courses.map((c) =>
          c._id === courseId ? { ...c, isPublic: !currentStatus } : c,
        ),
      );
      toast.success(res?.data?.message || "Course visibility updated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update visibility",
      );
    }
  };

  useEffect(() => {
    courseService
      .getAll()
      .then((res) => {
        setCourses(res.data.data.courses);
        setFetchingCourses(false);
      })
      .catch(() => {
        toast.error("Failed to load courses");
        setFetchingCourses(false);
      });
  }, []);

  if (fetchingCourses) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm font-medium text-gray-500">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-5 animate-fadeIn">
          <div className="bg-white rounded-xl p-3 md:p-4 shadow border border-gray-100 flex items-center gap-3">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              }}
            >
              <FaBook className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-black text-blue-700">
                {courses.length}
              </p>
              <p className="text-xs text-gray-500 leading-tight">Total</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 shadow border border-gray-100 flex items-center gap-3">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              }}
            >
              <FaGlobe className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-black text-green-700">
                {courses.filter((c) => c.isPublic).length}
              </p>
              <p className="text-xs text-gray-500 leading-tight">Public</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 shadow border border-gray-100 flex items-center gap-3">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              }}
            >
              <FaLock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-black text-yellow-700">
                {courses.filter((c) => !c.isPublic).length}
              </p>
              <p className="text-xs text-gray-500 leading-tight">Private</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 animate-fadeIn">
          <div>
            <h1
              className="text-xl md:text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              My Courses
            </h1>
            <p className="text-xs text-gray-500">
              {courses.length} {courses.length === 1 ? "course" : "courses"} in
              your library
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) cancelForm();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
            style={{
              background: showForm
                ? "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            }}
          >
            <FaPlus className="w-3.5 h-3.5" />
            {showForm ? "Cancel" : "New Course"}
          </button>
        </div>

        {/* Search */}
        {!showForm && courses.length > 0 && (
          <div className="mb-5">
            <div className="relative max-w-sm">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              />
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-5 mb-5 animate-slideDown border border-gray-100">
            <h2 className="text-base font-bold mb-4 text-gray-800">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </h2>
            <form onSubmit={editingCourse ? updateCourse : createCourse}>
              <div className="mb-4">
                <label className="block font-semibold mb-1.5 text-xs text-gray-600">
                  Course Title
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Complete Web Development Course"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1.5 text-xs text-gray-600">
                  Description
                </label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  rows={3}
                  placeholder="Describe what you'll learn..."
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white shadow transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: loading
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : editingCourse ? (
                    "Update Course"
                  ) : (
                    "Create Course"
                  )}
                </button>
                {editingCourse && (
                  <button
                    type="button"
                    onClick={cancelForm}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center animate-fadeIn border border-gray-100">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              }}
            >
              <FaBook className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-base font-bold mb-1 text-gray-700">
              {searchQuery ? "No courses found" : "No courses yet"}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search"
                : 'Click "New Course" above to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow p-5 border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/courses/${course._id}`}>
                  {course.isPublic && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-2"
                      style={{ background: "#d1fae5", color: "#065f46" }}
                    >
                      <FaGlobe className="w-3 h-3" /> Public
                    </span>
                  )}
                  <h3 className="font-bold text-base mb-1.5 line-clamp-2 text-gray-800">
                    {course.title}
                  </h3>
                  <p className="text-xs mb-3 line-clamp-2 text-gray-500">
                    {course.description}
                  </p>
                </Link>
                <div className="flex flex-col gap-1.5 pt-3 border-t border-gray-100">
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => startEdit(course, e)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      }}
                    >
                      <FaEdit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => togglePublic(course._id, course.isPublic)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: course.isPublic
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                      }}
                    >
                      {course.isPublic ? (
                        <>
                          <FaGlobe className="w-3 h-3" /> Public
                        </>
                      ) : (
                        <>
                          <FaLock className="w-3 h-3" /> Private
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    }}
                  >
                    <FaTrash className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
