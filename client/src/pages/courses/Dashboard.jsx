import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaGlobe,
  FaLock,
  FaEdit,
  FaTrash,
  FaBook,
} from "react-icons/fa";
import { useCoursesContext } from "../../context/CoursesContext/CoursesProvider";
import useCourseForm from "../../hooks/ui/useCourseForm";
import "./style/course.scss";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    courses,
    loading,
    fetchingCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublic,
    courseStats,
  } = useCoursesContext();

  const {
    courseTitle,
    setCourseTitle,
    courseDescription,
    setCourseDescription,
    showForm,
    editingCourse,
    startEdit,
    cancelForm,
    resetForm,
    toggleForm,
    getFormData,
    isFormValid,
    isEditing,
  } = useCourseForm();

  // Filter courses based on search
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const formData = getFormData();
    let result;

    if (isEditing) {
      result = await updateCourse(editingCourse._id, formData);
    } else {
      result = await createCourse(formData);
    }

    if (result.success) {
      resetForm();
    }
  };

  // Handle course actions
  const handleEditCourse = (course, e) => {
    e.preventDefault();
    startEdit(course);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course? All videos will be lost.")) return;
    await deleteCourse(courseId);
  };

  const handleTogglePublic = async (courseId, currentStatus) => {
    await togglePublic(courseId, currentStatus);
  };

  // Loading state
  if (fetchingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center loading-page">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium loading-page__text">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 dashboard__page">
      <div className="max-w-7xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fadeInUp">
          <div className="dashboard__stat-card rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 border">
            <div className="p-3 rounded-xl gradient-primary shrink-0">
              <FaBook className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black dashboard__stat-card__number">
                {courses.length}
              </h3>
              <p className="text-sm font-medium dashboard__stat-card__label">
                Total Courses
              </p>
            </div>
          </div>

          <div className="dashboard__stat-card rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 border">
            <div className="p-3 rounded-xl gradient-success shrink-0">
              <FaGlobe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black dashboard__stat-card__number">
                {courses.filter((c) => c.isPublic).length}
              </h3>
              <p className="text-sm font-medium dashboard__stat-card__label">
                Public Courses
              </p>
            </div>
          </div>

          <div className="dashboard__stat-card rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 border">
            <div className="p-3 rounded-xl gradient-warning shrink-0">
              <FaLock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black dashboard__stat-card__number">
                {courses.filter((c) => !c.isPublic).length}
              </h3>
              <p className="text-sm font-medium dashboard__stat-card__label">
                Private Courses
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeInUp animate-delay-100">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 dashboard__header__title">
              My Courses
            </h1>
            <p className="font-medium dashboard__header__subtitle">
              {courses.length} {courses.length === 1 ? "course" : "courses"} in
              your library
            </p>
          </div>
          <button
            onClick={toggleForm}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 btn ${
              showForm ? "btn--gray" : "btn--primary"
            }`}
          >
            <FaPlus className="w-4 h-4" />
            {showForm ? "Cancel" : "New Course"}
          </button>
        </div>

        {/* Search */}
        {!showForm && courses.length > 0 && (
          <div className="mb-8 animate-fadeInUp animate-delay-200">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 search-icon" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300 focus:shadow-md dashboard__search-input"
              />
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="dashboard__form rounded-2xl p-8 mb-8 border animate-slideDown">
            <h2 className="text-xl font-bold mb-6 dashboard__form__title">
              {isEditing ? "Edit Course" : "Create New Course"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 dashboard__form__label">
                  Course Title
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g., Complete Web Development Course"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300 dashboard__form__input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 dashboard__form__label">
                  Description
                </label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Describe what you'll learn..."
                  rows={4}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none resize-none transition-all duration-300 dashboard__form__input"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none btn btn--success"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Update Course"
                  ) : (
                    "Create Course"
                  )}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={cancelForm}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 btn btn--gray"
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
          <div className="dashboard__empty-state rounded-2xl p-12 text-center border animate-fadeInUp animate-delay-300">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center dashboard__empty-state__icon-bg">
              <FaBook className="w-8 h-8 dashboard__empty-state__icon" />
            </div>
            <h3 className="text-xl font-bold mb-2 dashboard__empty-state__title">
              {searchQuery ? "No courses found" : "No courses yet"}
            </h3>
            <p className="dashboard__empty-state__description">
              {searchQuery
                ? "Try adjusting your search terms"
                : 'Click "New Course" above to create your first course'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeInUp animate-delay-300">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="course-card rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2"
              >
                <Link to={`/courses/${course._id}`} className="block">
                  {course.isPublic && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mb-4 course-card__badge--public">
                      <FaGlobe className="w-3 h-3" /> Public
                    </span>
                  )}
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight course-card__title">
                    {course.title}
                  </h3>
                  <p className="text-sm mb-4 line-clamp-2 leading-relaxed course-card__description">
                    {course.description}
                  </p>

                  {/* Course Statistics */}
                  {courseStats[course._id] && (
                    <div className="text-xs text-muted mb-4 space-y-1">
                      <div className="flex justify-between">
                        <span>
                          {courseStats[course._id].totalVideos} videos
                        </span>
                        <span>
                          {courseStats[course._id].totalDurationFormatted}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {courseStats[course._id].completedVideos} completed
                        </span>
                        <span>
                          {courseStats[course._id].completionRate}% done
                        </span>
                      </div>
                    </div>
                  )}
                </Link>

                <div className="pt-4 border-t space-y-3 course-card__divider">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleEditCourse(course, e)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs text-white transition-all duration-300 hover:-translate-y-0.5 btn btn--primary"
                    >
                      <FaEdit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() =>
                        handleTogglePublic(course._id, course.isPublic)
                      }
                      className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs text-white transition-all duration-300 hover:-translate-y-0.5 btn ${
                        course.isPublic ? "btn--success" : "btn--gray"
                      }`}
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
                    onClick={() => handleDeleteCourse(course._id)}
                    className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs text-white transition-all duration-300 hover:-translate-y-0.5 btn btn--danger"
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
