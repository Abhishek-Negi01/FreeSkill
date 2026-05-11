import React, { createContext, useContext } from "react";
import useYoutube from "../../hooks/api/useYoutube";

const YoutubeContext = createContext();

export const useYoutubeContext = () => {
  const context = useContext(YoutubeContext);
  if (!context) {
    throw new Error("useYoutubeContext must be used within YoutubeProvider");
  }
  return context;
};

export const YoutubeProvider = ({ children }) => {
  const youtubeState = useYoutube();

  return (
    <YoutubeContext.Provider value={youtubeState}>
      {children}
    </YoutubeContext.Provider>
  );
};
