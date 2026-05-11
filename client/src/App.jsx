import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import AppProvider from "./context/AppProvider"; // Add this import

import Home from "./pages/Home";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicRoute from "./components/layout/PublicRoute";
import Dashboard from "./pages/courses/Dashboard";
import CourseDetails from "./pages/courses/CourseDetails";
import Navbar from "./components/layout/Navbar";
import Profile from "./pages/Profile";
import QuestionList from "./pages/questionAnswer/QuestionList";
import QuestionDetail from "./pages/questionAnswer/QuestionDetail";
import AskQuestion from "./pages/questionAnswer/AskQuestion";
import VideoQuestions from "./pages/questionAnswer/VideoQuestions";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Bookmarks from "./pages/Bookmarks";
import PublicCourses from "./pages/courses/PublicCourses";
import PublicCourseDetail from "./pages/courses/PublicCourseDetail";

const App = () => {
  return (
    <AppProvider>
      {" "}
      {/* Wrap everything with AppProvider */}
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login/*"
            element={
              <PublicRoute>
                <div
                  className="min-h-screen flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  }}
                >
                  <SignIn routing="path" path="/login" signUpUrl="/register" />
                </div>
              </PublicRoute>
            }
          />
          <Route
            path="/register/*"
            element={
              <PublicRoute>
                <div
                  className="min-h-screen flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  }}
                >
                  <SignUp routing="path" path="/register" signInUrl="/login" />
                </div>
              </PublicRoute>
            }
          />

          {/* Q&A routes */}
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route
            path="/questions/video/:videoId"
            element={<VideoQuestions />}
          />

          {/* public course routes */}
          <Route path="/public-courses" element={<PublicCourses />} />
          <Route path="/public-courses/:id" element={<PublicCourseDetail />} />

          {/* protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <AskQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
