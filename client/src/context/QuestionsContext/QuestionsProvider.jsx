import React, { createContext, useContext, useState } from "react";
import useQuestions from "../../hooks/api/useQuestions";

const QuestionsContext = createContext();

export const useQuestionsContext = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error(
      "useQuestionsContext must be used within QuestionsProvider",
    );
  }
  return context;
};

export const QuestionsProvider = ({ children }) => {
  const [currentVideoId, setCurrentVideoId] = useState(null);

  // Use the hook with current video ID
  const questionsState = useQuestions(currentVideoId);

  const value = {
    ...questionsState,
    currentVideoId,
    setCurrentVideoId,
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};
