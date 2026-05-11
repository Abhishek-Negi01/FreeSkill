import { useState, useEffect, useCallback } from "react";
import { courseService } from "../../api/services/courses";
import { videoServices } from "../../api/services/videos";
import toast from "react-hot-toast";

const usePublicCourseDetail = (courseId) => {
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course details and videos
  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);

      const [courseRes, videosRes] = await Promise.all([
        courseService.getPublicCourse(courseId),
        videoServices.getPublicVideos(courseId),
      ]);

      setCourse(courseRes.data.data.course);
      setVideos(videosRes.data.data.videos);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load course details";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Clone course
  const cloneCourse = async () => {
    try {
      await courseService.clonePublicCourse(courseId);
      toast.success("Course cloned successfully!");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to clone course. Please login first.";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Format duration helper
  const formatDuration = useCallback((duration) => {
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
  }, []);

  // Calculate total duration
  const totalDuration = useCallback(() => {
    if (!videos.length) return "0:00";

    let totalSeconds = 0;
    videos.forEach((video) => {
      const match = video.duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      if (match) {
        const hours = parseInt((match[1] || "").replace("H", "")) || 0;
        const minutes = parseInt((match[2] || "").replace("M", "")) || 0;
        const seconds = parseInt((match[3] || "").replace("S", "")) || 0;
        totalSeconds += hours * 3600 + minutes * 60 + seconds;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, [videos]);

  // Load course details when courseId changes
  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  return {
    // Data
    course,
    videos,
    loading,
    error,

    // Actions
    cloneCourse,

    // Utils
    fetchCourseDetails,
    formatDuration,
    totalDuration: totalDuration(),
    refetch: fetchCourseDetails,

    // Computed
    videoCount: videos.length,
    hasVideos: videos.length > 0,
    courseNotFound: !loading && !course,
  };
};

export default usePublicCourseDetail;
