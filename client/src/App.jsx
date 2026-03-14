import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
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
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Bookmarks from "./pages/Bookmarks";
import PublicCourses from "./pages/courses/PublicCourses";
import PublicCourseDetail from "./pages/courses/PublicCourseDetail";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          {/* Question & Answers routes */}
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route
            path="/questions/video/:videoId"
            element={<VideoQuestions />}
          />

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
    </AuthProvider>
  );
};

export default App;
