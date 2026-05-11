import { useState, useEffect } from "react";
import { videoServices } from "../../api/services/videos";
import { youtubeServices } from "../../api/services/youtube";
import toast from "react-hot-toast";

const useVideos = (courseId) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingVideos, setFetchingVideos] = useState(false);
  const [error, setError] = useState(null);

  // Fetch videos for a course
  const fetchVideos = async () => {
    if (!courseId) return;
    setFetchingVideos(true);
    try {
      const res = await videoServices.getAll(courseId);
      setVideos(res.data.data.videos);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load videos");
      toast.error("Failed to load videos");
    } finally {
      setFetchingVideos(false);
    }
  };

  // Add video to course
  const addVideo = async (videoData) => {
    setLoading(true);
    try {
      const res = await videoServices.addVideo(courseId, videoData);
      setVideos((prev) => [...prev, res.data.data.video]);
      toast.success(res?.data?.message || "Video added successfully!");
      return { success: true, video: res.data.data.video };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to add video";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete video
  const deleteVideo = async (videoId) => {
    try {
      const res = await videoServices.deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      toast.success(res?.data?.message || "Video deleted successfully!");
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete video";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Mark video as completed
  const markComplete = async (videoId) => {
    try {
      const res = await videoServices.markCompleted(videoId);
      const updatedVideo = res.data.data.video;

      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId
            ? { ...v, isCompleted: updatedVideo.isCompleted }
            : v,
        ),
      );

      const status = updatedVideo.isCompleted ? "completed" : "incomplete";
      toast.success(`Video marked as ${status}!`);
      return { success: true, video: updatedVideo };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update video";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Reorder videos
  const reorderVideos = async (videoIds) => {
    setLoading(true);
    try {
      // Send as flat array of IDs
      const res = await videoServices.reorderVideos(courseId, videoIds);
      await fetchVideos();
      toast.success("Videos reordered successfully!");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to reorder videos";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Import video by URL
  const importVideo = async (videoUrl) => {
    setLoading(true);
    try {
      const res = await youtubeServices.importVideo(courseId, videoUrl);
      await fetchVideos(); // Refresh videos list
      toast.success(res.data.message || "Video imported successfully!");
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to import video";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Import playlist
  const importPlaylist = async (playlistUrl) => {
    setLoading(true);
    try {
      const res = await youtubeServices.importPlaylist(courseId, playlistUrl);
      await fetchVideos(); // Refresh videos list
      const data = res.data.data;
      toast.success(
        `Imported ${data.imported} videos${data.skipped > 0 ? `, skipped ${data.skipped}` : ""}`,
      );
      return { success: true, data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to import playlist";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Load videos when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchVideos();
    }
  }, [courseId]);

  return {
    // Data
    videos,
    loading,
    fetchingVideos,
    error,

    // Actions
    addVideo,
    deleteVideo,
    markComplete,
    reorderVideos,
    importVideo,
    importPlaylist,

    // Utils
    fetchVideos,
    refetch: fetchVideos,
  };
};

export default useVideos;
