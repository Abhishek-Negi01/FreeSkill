import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useCoursesContext } from "../../context/CoursesContext/CoursesProvider";
import { useVideosContext } from "../../context/VideosContext/VideosProvider";
import useVideoPlayer from "../../hooks/ui/useVideoPlayer";
import useVideoReorder from "../../hooks/ui/useVideoReorder";
import YouTubeSearch from "../../components/YouTubeSearch";
import ImportVideo from "../../components/ImportVideo";
import SmartSearch from "../../components/SmartSearch";
import toast from "react-hot-toast";
import {
  FaPlay,
  FaTrash,
  FaCheckCircle,
  FaEyeSlash,
  FaEye,
  FaClock,
  FaUser,
  FaCalendar,
  FaGraduationCap,
  FaChartLine,
  FaListOl,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import "./style/course.scss";

const CourseDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Use contexts
  const { courses } = useCoursesContext();
  const {
    videos,
    loading: videosLoading,
    setCurrentCourseId,
    addVideo,
    deleteVideo,
    markComplete,
    importVideo,
    importPlaylist,
    fetchVideos,
    reorderVideos,
  } = useVideosContext();

  // Use custom hooks
  const {
    currentVideo,
    setCurrentVideo,
    showVideoPlayer,
    setShowVideoPlayer,
    handleVideoDeleted,
  } = useVideoPlayer(videos, location);

  const {
    reorderMode,
    setReorderMode,
    draggedVideo,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useVideoReorder();

  // Calculate progress and stats
  const progress =
    videos.length === 0
      ? 0
      : Math.round(
          (videos.filter((v) => v.isCompleted).length / videos.length) * 100,
        );

  const completedVideos = videos.filter((v) => v.isCompleted).length;
  const totalDuration = videos.reduce((acc, video) => {
    const match = video.duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (match) {
      const hours = parseInt((match[1] || "").replace("H", "")) || 0;
      const minutes = parseInt((match[2] || "").replace("M", "")) || 0;
      const seconds = parseInt((match[3] || "").replace("S", "")) || 0;
      return acc + hours * 3600 + minutes * 60 + seconds;
    }
    return acc;
  }, 0);

  const formatTotalDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Load course and set current course ID for videos
  useEffect(() => {
    const foundCourse = courses.find((c) => c._id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      setLoading(false);
    } else if (courses.length > 0) {
      setLoading(false);
    }
    setCurrentCourseId(id);
  }, [id, courses, setCurrentCourseId]);

  // Handle video actions
  const handleAddVideo = async (video) => {
    const result = await addVideo({
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      channelTitle: video.channelTitle,
      duration: video.duration,
    });

    if (result.success && !currentVideo) {
      setCurrentVideo(result.video);
    }
  };

  const handleVideoComplete = async (videoId, currentStatus) => {
    await markComplete(videoId);
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    const result = await deleteVideo(videoId);
    if (result.success) {
      handleVideoDeleted(videoId);
    }
  };

  const handleImportPlaylist = async (playlistUrl) => {
    await importPlaylist(playlistUrl);
  };

  const handleReorderVideos = async (videoOrder, newVideos) => {
    await reorderVideos(videoOrder);
  };

  // Format duration helper
  const formatDuration = (duration) => {
    if (!duration) return "";
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "";
    const hours = (match[1] || "").replace("H", "");
    const minutes = (match[2] || "").replace("M", "");
    const seconds = (match[3] || "").replace("S", "");
    if (hours) {
      return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }
    return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="dashboard__page">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-6 spinner"></div>
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-xl font-bold text-primary mb-2">
                Loading Course
              </h3>
              <p className="text-secondary">
                Preparing your learning experience...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="dashboard__page">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-effect rounded-2xl p-12 text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
              <FaGraduationCap className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">
              Course Not Found
            </h3>
            <p className="text-secondary mb-6">
              This course may have been deleted or you don't have access to it.
            </p>
            <Link
              to="/dashboard"
              className="btn btn--primary inline-flex items-center gap-2"
            >
              <FaChartLine className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard__page">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
        {/* Enhanced Course Header */}
        <div className="bg-card rounded-2xl shadow-2xl p-6 lg:p-8 mb-6 animate-fadeInUp border border-light relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            {/* Course Title & Meta */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <FaGraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-primary leading-tight">
                      {course.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        Created by You
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendar className="w-3 h-3" />
                        {new Date(
                          course.createdAt || Date.now(),
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-secondary leading-relaxed max-w-3xl">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:min-w-[200px]">
                <div className="bg-card-hover rounded-xl p-4 border border-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-info flex items-center justify-center">
                      <FaListOl className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-primary">
                        {videos.length}
                      </p>
                      <p className="text-xs text-muted font-medium">
                        Total Videos
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card-hover rounded-xl p-4 border border-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-success flex items-center justify-center">
                      <FaClock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-primary">
                        {formatTotalDuration(totalDuration)}
                      </p>
                      <p className="text-xs text-muted font-medium">Duration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Section */}
            <div className="bg-card-hover rounded-2xl p-6 mb-8 border border-medium">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
                    <FaChartLine className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">
                    Learning Progress
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-gradient-primary">
                    {progress}%
                  </p>
                  <p className="text-sm text-muted">
                    {completedVideos} of {videos.length} completed
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-4 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-success transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted mt-2">
                  <span>Started</span>
                  <span className="font-medium">
                    {progress === 100 ? "Completed! 🎉" : "In Progress"}
                  </span>
                  <span>Complete</span>
                </div>
              </div>
            </div>

            {/* Search & Import Tools */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
                  <FaPlay className="w-3 h-3 text-white" />
                </div>
                Add Content
              </h3>
              <div className="grid gap-4">
                <YouTubeSearch onAddVideo={handleAddVideo} />
                <ImportVideo />
                <SmartSearch
                  onAddVideo={handleAddVideo}
                  onImportPlaylist={handleImportPlaylist}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Player + Playlist Layout */}
        <div
          className={`grid gap-6 transition-all duration-500 ${
            isFullscreen ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-3"
          }`}
        >
          {/* Enhanced Video Player */}
          <div className={`${isFullscreen ? "col-span-1" : "xl:col-span-2"}`}>
            {showVideoPlayer && currentVideo ? (
              <div className="bg-card rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp border border-light">
                {/* Player Header */}
                <div className="p-4 border-b border-medium bg-card-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <FaPlay className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-primary">Now Playing</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="btn btn--gray btn--sm"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                      </button>
                      <button
                        onClick={() => setShowVideoPlayer(false)}
                        className="btn btn--gray btn--sm"
                      >
                        <FaEyeSlash /> Hide
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative">
                  <div className="aspect-video bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                      title={currentVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-primary mb-2 leading-tight">
                    {currentVideo.title}
                  </h2>
                  <p className="text-secondary mb-4 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    {currentVideo.channelTitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/ask?videoId=${currentVideo._id}`}
                      className="btn btn--primary flex-1 justify-center"
                    >
                      Ask Question
                    </Link>
                    <Link
                      to={`/questions/video/${currentVideo._id}`}
                      className="btn btn--gray flex-1 justify-center"
                    >
                      View Questions
                    </Link>
                  </div>
                </div>
              </div>
            ) : !showVideoPlayer && currentVideo ? (
              <div className="bg-card rounded-2xl shadow-2xl p-12 text-center animate-fadeInUp border border-light">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center">
                  <FaPlay className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Video Hidden
                </h3>
                <p className="text-secondary mb-6">
                  Click below to show the video player
                </p>
                <button
                  onClick={() => setShowVideoPlayer(true)}
                  className="btn btn--primary"
                >
                  <FaEye className="mr-2" /> Show Video
                </button>
              </div>
            ) : (
              <div className="bg-card rounded-2xl shadow-2xl p-12 text-center border border-light">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex items-center justify-center">
                  <FaPlay className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  No Video Selected
                </h3>
                <p className="text-secondary">
                  Choose a video from the playlist or add new content above
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Playlist */}
          {!isFullscreen && (
            <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-light">
              {/* Playlist Header */}
              <div className="sticky top-0 z-20 p-4 border-b border-medium bg-card-hover backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                      <FaListOl className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="font-bold text-primary">Course Playlist</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {videos.length} {videos.length === 1 ? "video" : "videos"}
                    </span>
                    {videos.length > 1 && (
                      <button
                        onClick={() => setReorderMode(!reorderMode)}
                        className={`btn btn--sm ${
                          reorderMode ? "btn--success" : "btn--info"
                        }`}
                      >
                        {reorderMode ? "Done" : "Reorder"}
                      </button>
                    )}
                  </div>
                </div>

                {videos.length > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-2">
                      <span>{completedVideos} completed</span>
                      <span>{progress}% progress</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Video List */}
              <div
                className="dark-scrollbar"
                style={{
                  maxHeight: "calc(100vh - 300px)",
                  minHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {videos.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex items-center justify-center">
                      <FaPlay className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-primary mb-2">
                      No Videos Yet
                    </h3>
                    <p className="text-sm text-muted">
                      Add videos using the tools above to start building your
                      course
                    </p>
                  </div>
                ) : (
                  <div className="p-3 space-y-3">
                    {videos.map((video, index) => (
                      <div
                        key={video._id}
                        draggable={reorderMode}
                        onDragStart={(e) => handleDragStart(e, video)}
                        onDragOver={handleDragOver}
                        onDrop={(e) =>
                          handleDrop(e, video, videos, handleReorderVideos)
                        }
                        className={`group relative rounded-xl p-3 transition-all duration-300 cursor-pointer border-2 ${
                          currentVideo?._id === video._id
                            ? "neon-border bg-blue-500/10"
                            : draggedVideo?._id === video._id
                              ? "border-purple-500 bg-purple-500/10"
                              : "border-medium bg-card-hover hover:border-light hover:shadow-lg"
                        }`}
                        style={{
                          opacity: draggedVideo?._id === video._id ? 0.5 : 1,
                        }}
                        onClick={() => !reorderMode && setCurrentVideo(video)}
                      >
                        {/* Video Item */}
                        <div className="flex items-start gap-3">
                          {/* Index */}
                          <div
                            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                              currentVideo?._id === video._id
                                ? "gradient-primary text-white"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {index + 1}
                          </div>

                          {/* Thumbnail */}
                          <div className="relative shrink-0 w-28 h-16 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={
                                video.thumbnail ||
                                `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
                              }
                              alt={video.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <FaPlay className="w-6 h-6 text-white" />
                            </div>
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-bold bg-black/80 text-white">
                              {formatDuration(video.duration)}
                            </span>
                          </div>

                          {/* Video Info */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold text-sm line-clamp-2 mb-1 ${
                                currentVideo?._id === video._id
                                  ? "text-blue-400"
                                  : "text-primary"
                              }`}
                            >
                              {video.title}
                            </h3>
                            <p className="text-xs text-muted truncate mb-2">
                              {video.channelTitle}
                            </p>
                            {video.isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                <FaCheckCircle className="w-3 h-3" /> Completed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-medium">
                          <label
                            className="flex items-center gap-2 cursor-pointer group/checkbox"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={video.isCompleted}
                              onChange={() =>
                                handleVideoComplete(
                                  video._id,
                                  video.isCompleted,
                                )
                              }
                              className="w-4 h-4 rounded border-2 border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-xs text-muted group-hover/checkbox:text-green-400 transition-colors font-medium">
                              Mark Complete
                            </span>
                          </label>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteVideo(video._id);
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
