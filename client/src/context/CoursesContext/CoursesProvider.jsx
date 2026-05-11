import React, { createContext, useContext } from "react";
import useCourses from "../../hooks/api/useCourses";

const CoursesContext = createContext();

export const useCoursesContext = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error("useCoursesContext must be used within CoursesProvider");
  }
  return context;
};

export const CoursesProvider = ({ children }) => {
  const coursesState = useCourses();

  return (
    <CoursesContext.Provider value={coursesState}>
      {children}
    </CoursesContext.Provider>
  );
};
