import { useState } from "react";

const useVideoReorder = () => {
  const [reorderMode, setReorderMode] = useState(false);
  const [draggedVideo, setDraggedVideo] = useState(null);

  const handleDragStart = (e, video) => {
    setDraggedVideo(video);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetVideo, videos, onReorder) => {
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
    onReorder(videoOrder, newVideos);
    setDraggedVideo(null);
  };

  const resetReorder = () => {
    setReorderMode(false);
    setDraggedVideo(null);
  };

  return {
    reorderMode,
    setReorderMode,
    draggedVideo,
    setDraggedVideo,
    handleDragStart,
    handleDragOver,
    handleDrop,
    resetReorder,
  };
};

export default useVideoReorder;
