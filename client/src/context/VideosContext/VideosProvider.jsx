import React, { createContext, useContext, useState } from "react";
import useVideos from "../../hooks/api/useVideos";

const VideosContext = createContext();

export const useVideosContext = () => {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error("useVideosContext must be used within VideosProvider");
  }
  return context;
};

export const VideosProvider = ({ children }) => {
  const [currentCourseId, setCurrentCourseId] = useState(null);

  // Use the hook with current course ID
  const videosState = useVideos(currentCourseId);

  const value = {
    ...videosState,
    currentCourseId,
    setCurrentCourseId,
  };

  return (
    <VideosContext.Provider value={value}>{children}</VideosContext.Provider>
  );
};
