import { useState, useEffect } from "react";

const useVideoPlayer = (videos, location) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(true);

  // Set initial video based on location state or first video
  useEffect(() => {
    if (videos.length === 0) {
      setCurrentVideo(null);
      return;
    }

    const targetVideoId = location?.state?.videoId;
    if (targetVideoId) {
      const targetVideo = videos.find((v) => v._id === targetVideoId);
      setCurrentVideo(targetVideo || videos[0]);
    } else if (!currentVideo) {
      setCurrentVideo(videos[0]);
    }
  }, [videos, location]);

  // Update current video if it gets deleted
  const handleVideoDeleted = (deletedVideoId) => {
    if (currentVideo?._id === deletedVideoId) {
      const remainingVideos = videos.filter((v) => v._id !== deletedVideoId);
      setCurrentVideo(remainingVideos[0] || null);
    }
  };

  return {
    currentVideo,
    setCurrentVideo,
    showVideoPlayer,
    setShowVideoPlayer,
    handleVideoDeleted,
  };
};

export default useVideoPlayer;
