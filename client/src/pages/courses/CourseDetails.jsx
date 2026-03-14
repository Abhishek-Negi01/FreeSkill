import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { courseService } from "../../api/services/courses";
import { videoServices } from "../../api/services/videos";
import YouTubeSearch from "../../components/YouTubeSearch";
import toast from "react-hot-toast";
import ImportVideo from "../../components/ImportVideo";
import SmartSearch from "../../components/SmartSearch";
import { youtubeServices } from "../../api/services/youtube.js";
import {
  FaPlay,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [draggedVideo, setDraggedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(true);

  const progress =
    videos.length === 0
      ? 0
      : Math.round(
          (videos.filter((v) => v.isCompleted).length / videos.length) * 100,
        );

  const location = useLocation();

  const fetchVideos = async () => {
    try {
      const res = await videoServices.getAll(id);
      setVideos(res.data.data.videos);

      const targetVideoId = location.state?.videoId;
      if (targetVideoId) {
        const targetVideo = res.data.data.videos.find(
          (v) => v._id === targetVideoId,
        );
        setCurrentVideo(targetVideo || res.data.data.videos[0]);
      } else if (res.data.data.videos.length > 0 && !currentVideo) {
        setCurrentVideo(res.data.data.videos[0]);
      }
    } catch (error) {
      toast.error("Failed to load videos");
      console.log(error);
    }
  };

  useEffect(() => {
    courseService
      .getById(id)
      .then((res) => {
        setCourse(res.data.data.course);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    fetchVideos();
  }, [id]);

  const handleAddVideo = async (video) => {
    try {
      const res = await videoServices.addVideo(id, {
        videoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        duration: video.duration,
      });

      const newVideo = res.data.data.video;
      setVideos([...videos, newVideo]);
      if (!currentVideo) {
        setCurrentVideo(newVideo);
      }
      toast.success(res?.data?.message || "Video added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add video");
      console.log(error);
    }
  };

  const handleVideoComplete = async (videoId, currentStatus) => {
    try {
      if (currentStatus) {
        return;
      }

      const res = await videoServices.markCompleted(videoId);
      setVideos(
        videos.map((v) =>
          v._id === videoId ? { ...v, isCompleted: true } : v,
        ),
      );

      toast.success(res?.data?.message || "Video marked as complete!");
    } catch (error) {
      toast.error("Failed to mark video as complete");
      console.log(error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      if (!confirm("Delete this video?")) {
        return;
      }

      const res = await videoServices.deleteVideo(videoId);
      const updatedVideos = videos.filter((v) => v._id !== videoId);
      setVideos(updatedVideos);

      if (currentVideo?._id === videoId) {
        setCurrentVideo(updatedVideos[0] || null);
      }

      toast.success(res?.data?.message || "Video deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete video");
      console.log(error);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) {
      return "";
    }

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) {
      return "";
    }
    const hours = (match[1] || "").replace("H", "");
    const minutes = (match[2] || "").replace("M", "");
    const seconds = (match[3] || "").replace("S", "");

    if (hours) {
      return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }
    return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
  };

  const handleImportPlaylist = async (playlistUrl) => {
    try {
      const response = await youtubeServices.importPlaylist(id, playlistUrl);
      const data = response.data.data;
      toast.success(
        `Imported ${data.imported} videos${data.skipped > 0 ? `, skipped ${data.skipped}` : ""}`,
      );
      fetchVideos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import playlist");
    }
  };

  const handleDragStart = (e, video) => {
    setDraggedVideo(video);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetVideo) => {
    e.preventDefault();

    if (!draggedVideo || draggedVideo._id === targetVideo._id) {
      setDraggedVideo(null);
      return;
    }

    const draggedIndex = videos.findIndex((v) => v._id === draggedVideo._id);
    const targetIndex = videos.findIndex((v) => v._id === targetVideo._id);

    const newVideos = [...videos];
    newVideos.splice(draggedIndex, 1);
    newVideos.splice(targetIndex, 0, draggedVideo);

    const videoOrder = newVideos.map((v) => v._id);

    try {
      await videoServices.reorderVideos(id, videoOrder);
      setVideos(newVideos);
      toast.success("Videos reordered successfully!");
    } catch (error) {
      toast.error("Failed to reorder videos");
      console.log(error);
    }

    setDraggedVideo(null);
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

  if (!course) {
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
          <h3 className="text-xl font-bold mb-2" style={{ color: "#374151" }}>
            Course not found
          </h3>
          <p style={{ color: "#6b7280" }}>This course may have been deleted</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-3 sm:p-4 md:p-6"
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-4 md:mb-6 animate-fadeIn border border-gray-100">
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 leading-tight">
              {course.title}
            </h1>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div
            className="mb-4 p-3 md:p-4 rounded-lg"
            style={{ background: "#f0fdf4", border: "1px solid #86efac" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-600">
                {videos.filter((v) => v.isCompleted).length} / {videos.length}{" "}
                videos completed
              </span>
              <span className="text-sm sm:text-base font-black text-green-600">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden bg-green-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                }}
              />
            </div>
          </div>

          {/* Search & Import */}
          <div className="space-y-3">
            <YouTubeSearch onAddVideo={handleAddVideo} />
            <ImportVideo courseId={id} onVideoImported={fetchVideos} />
            <SmartSearch
              onAddVideo={handleAddVideo}
              onImportPlaylist={handleImportPlaylist}
            />
          </div>
        </div>

        {/* Player + Playlist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            {showVideoPlayer && currentVideo ? (
              <div className="bg-white rounded-xl shadow p-3 sm:p-4 md:p-5 animate-fadeIn border border-gray-100">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setShowVideoPlayer(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    }}
                  >
                    <FaEyeSlash className="w-3.5 h-3.5" />
                    Hide
                  </button>
                </div>
                <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 leading-snug">
                  {currentVideo.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-3">
                  {currentVideo.channelTitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/ask?videoId=${currentVideo._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    }}
                  >
                    Ask Question
                  </Link>
                  <Link
                    to={`/questions/video/${currentVideo._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    }}
                  >
                    View Questions
                  </Link>
                </div>
              </div>
            ) : !showVideoPlayer && currentVideo ? (
              <div className="bg-white rounded-xl shadow p-8 text-center animate-fadeIn border border-gray-100">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  }}
                >
                  <FaPlay className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-base font-bold mb-1 text-gray-700">
                  Video Hidden
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Click below to show the video player
                </p>
                <button
                  onClick={() => setShowVideoPlayer(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  }}
                >
                  <FaEye className="w-4 h-4" /> Show Video
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center border border-gray-100">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  }}
                >
                  <FaPlay className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-base font-bold mb-1 text-gray-700">
                  No videos yet
                </h3>
                <p className="text-sm text-gray-500">
                  Add videos using the search above
                </p>
              </div>
            )}
          </div>

          {/* Playlist */}
          <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 p-3 sm:p-4 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    }}
                  >
                    <FaPlay className="w-3 h-3 text-white" />
                  </div>
                  Playlist
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-bold text-blue-700"
                    style={{ background: "#dbeafe" }}
                  >
                    {videos.length} {videos.length === 1 ? "video" : "videos"}
                  </span>
                  {videos.length > 1 && (
                    <button
                      onClick={() => setReorderMode(!reorderMode)}
                      className="px-2.5 py-1 rounded-full text-xs font-bold text-white transition-all duration-200"
                      style={{
                        background: reorderMode
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      }}
                    >
                      {reorderMode ? "Done" : "Reorder"}
                    </button>
                  )}
                </div>
              </div>
              {videos.length > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {videos.filter((v) => v.isCompleted).length} completed
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background:
                          "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Video List */}
            <div
              className="p-3"
              style={{
                maxHeight: "calc(100vh - 260px)",
                minHeight: "300px",
                overflowY: "auto",
              }}
            >
              {videos.length === 0 ? (
                <div className="text-center py-10">
                  <FaPlay className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">
                    No videos yet
                  </p>
                  <p className="text-xs text-gray-400">
                    Add videos using the search above
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {videos.map((video, index) => (
                    <div
                      key={video._id}
                      draggable={reorderMode}
                      onDragStart={(e) => handleDragStart(e, video)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, video)}
                      className="border-2 rounded-xl p-2.5 transition-all duration-200"
                      style={{
                        background:
                          currentVideo?._id === video._id
                            ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
                            : "white",
                        borderColor:
                          currentVideo?._id === video._id
                            ? "#3b82f6"
                            : draggedVideo?._id === video._id
                              ? "#8b5cf6"
                              : "#e5e7eb",
                        cursor: reorderMode ? "move" : "pointer",
                        opacity: draggedVideo?._id === video._id ? 0.5 : 1,
                      }}
                      onClick={() => !reorderMode && setCurrentVideo(video)}
                      onMouseEnter={(e) => {
                        if (currentVideo?._id !== video._id && !reorderMode)
                          e.currentTarget.style.transform = "translateX(3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            background:
                              currentVideo?._id === video._id
                                ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                                : "#f3f4f6",
                            color:
                              currentVideo?._id === video._id
                                ? "white"
                                : "#6b7280",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="relative shrink-0 w-24 sm:w-28 group overflow-hidden rounded-lg">
                          <img
                            src={
                              video.thumbnail ||
                              `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
                            }
                            alt={video.title}
                            className="w-full h-14 object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                            }}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center">
                            <FaPlay className="w-5 h-5 text-white scale-0 group-hover:scale-100 transition-transform duration-300" />
                          </div>
                          <span
                            className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-xs font-semibold"
                            style={{
                              background: "rgba(0,0,0,0.85)",
                              color: "white",
                            }}
                          >
                            {formatDuration(video.duration)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-xs line-clamp-2 mb-0.5"
                            style={{
                              color:
                                currentVideo?._id === video._id
                                  ? "#1e40af"
                                  : "#1f2937",
                            }}
                          >
                            {video.title}
                          </h3>
                          <p className="text-xs truncate text-gray-500">
                            {video.channelTitle}
                          </p>
                          {video.isCompleted && (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold mt-1"
                              style={{
                                background: "#d1fae5",
                                color: "#065f46",
                              }}
                            >
                              <FaCheckCircle className="w-2.5 h-2.5" /> Done
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <label
                          className="flex items-center gap-1.5 cursor-pointer group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={video.isCompleted}
                            onChange={() =>
                              handleVideoComplete(video._id, video.isCompleted)
                            }
                            className="w-4 h-4 rounded border-2 border-gray-300 cursor-pointer appearance-none checked:bg-green-500 checked:border-green-500"
                            style={{
                              backgroundImage: video.isCompleted
                                ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
                                : "none",
                            }}
                          />
                          <span className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">
                            Complete
                          </span>
                        </label>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVideo(video._id);
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-red-500 transition-all hover:bg-red-50"
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
        </div>
      </div>
    </div>
  );
  
};

export default CourseDetails;
