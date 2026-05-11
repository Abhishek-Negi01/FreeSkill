import React from "react";
import { AuthProvider } from "./AuthContext/AuthProvider";
import { CoursesProvider } from "./CoursesContext/CoursesProvider";
import { VideosProvider } from "./VideosContext/VideosProvider";
import { QuestionsProvider } from "./QuestionsContext/QuestionsProvider";
import { YoutubeProvider } from "./YoutubeContext/YoutubeProvider";
import { NotificationProvider } from "./NotificationContext/NotificationProvider";
import { ThemeProvider } from "./ThemeContext/ThemeProvider";

const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <CoursesProvider>
            <VideosProvider>
              <QuestionsProvider>
                <YoutubeProvider>{children}</YoutubeProvider>
              </QuestionsProvider>
            </VideosProvider>
          </CoursesProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
