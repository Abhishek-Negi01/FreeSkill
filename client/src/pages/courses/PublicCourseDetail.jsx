import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePublicCourseDetail from "../../hooks/api/usePublicCourseDetail";
import {
  FaArrowLeft,
  FaUser,
  FaVideo,
  FaEye,
  FaClone,
  FaClock,
} from "react-icons/fa";
import { MdPublic } from "react-icons/md";

const PublicCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    course,
    videos,
    loading,
    cloneCourse,
    formatDuration,
    totalDuration,
    videoCount,
    hasVideos,
    courseNotFound,
  } = usePublicCourseDetail(id);

  const handleClone = async () => {
    const result = await cloneCourse();
    if (result.success) {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    navigate("/public-courses");
  };

  if (loading) {
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
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  if (courseNotFound) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div
          className="bg-white rounded-xl shadow-lg p-8 text-center"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <h3
            className="text-xl md:text-2xl font-bold mb-2"
            style={{ color: "#374151" }}
          >
            Course not found
          </h3>
          <p className="mb-6 text-sm md:text-base" style={{ color: "#6b7280" }}>
            This course may have been removed or made private
          </p>
          <button
            onClick={handleBack}
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
            <FaArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
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
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 mb-6 text-sm md:text-base font-semibold transition-all hover:gap-3"
          style={{ color: "#3b82f6" }}
        >
          <FaArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Course Header */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 animate-fadeIn"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <div className="flex items-start justify-between mb-4">
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold flex-1"
              style={{ color: "#1f2937" }}
            >
              {course.title}
            </h1>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ml-3 shrink-0"
              style={{ background: "#d1fae5", color: "#065f46" }}
            >
              <MdPublic className="w-4 h-4 md:w-5 md:h-5" />
              Public
            </span>
          </div>

          <p
            className="text-sm md:text-base lg:text-lg mb-6"
            style={{ color: "#6b7280" }}
          >
            {course.description}
          </p>

          <div
            className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base mb-6 pb-6 border-b"
            style={{ color: "#9ca3af", borderColor: "#e5e7eb" }}
          >
            <span className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              <span className="font-medium">
                {course.creatorUsername || "Unknown"}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <FaVideo className="w-4 h-4" />
              <span className="font-medium">{videoCount} videos</span>
            </span>
            <span className="flex items-center gap-2">
              <FaClock className="w-4 h-4" />
              <span className="font-medium">{totalDuration}</span>
            </span>
            <span className="flex items-center gap-2">
              <FaEye className="w-4 h-4" />
              <span className="font-medium">{course.viewCount || 0} views</span>
            </span>
            <span className="flex items-center gap-2">
              <FaClone className="w-4 h-4" />
              <span className="font-medium">
                {course.cloneCount || 0} clones
              </span>
            </span>
          </div>

          <button
            onClick={handleClone}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaClone className="w-4 h-4 md:w-5 md:h-5" />
            Clone This Course
          </button>
        </div>

        {/* Course Content */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fadeIn"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <h2
            className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2"
            style={{ color: "#1f2937" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              }}
            >
              <FaVideo className="w-5 h-5" style={{ color: "white" }} />
            </div>
            Course Content
          </h2>

          {!hasVideos ? (
            <div className="text-center py-12">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                }}
              >
                <FaVideo className="w-10 h-10" style={{ color: "#9ca3af" }} />
              </div>
              <p className="text-sm md:text-base" style={{ color: "#6b7280" }}>
                No videos in this course
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {videos.map((video, index) => (
                <div
                  key={video._id}
                  className="border rounded-xl p-4 hover:bg-gray-50 transition-all duration-300"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <div className="flex gap-3 md:gap-4">
                    <span
                      className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold"
                      style={{ background: "#dbeafe", color: "#1e40af" }}
                    >
                      {index + 1}
                    </span>
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
                      }
                      alt={video.title}
                      className="w-24 md:w-32 lg:w-40 h-16 md:h-20 lg:h-24 object-cover rounded-lg shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                      }}
                      loading="lazy"
                      style={{ display: "block" }}
                    />

                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-sm md:text-base lg:text-lg mb-1 line-clamp-2"
                        style={{ color: "#1f2937" }}
                      >
                        {video.title}
                      </h3>
                      <p
                        className="text-xs md:text-sm mb-1"
                        style={{ color: "#6b7280" }}
                      >
                        {video.channelTitle}
                      </p>
                      <p
                        className="text-xs md:text-sm flex items-center gap-1"
                        style={{ color: "#9ca3af" }}
                      >
                        <FaClock className="w-3 h-3" />
                        {formatDuration(video.duration)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicCourseDetail;
