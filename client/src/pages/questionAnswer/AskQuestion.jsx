import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useQuestions from "../../hooks/api/useQuestions";
import useQuestionForm from "../../hooks/ui/useQuestionForm";
import toast from "react-hot-toast";
import {
  FaVideo,
  FaQuestionCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const AskQuestion = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId");
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  // Use existing useQuestions hook for creating questions
  const { createQuestion } = useQuestions();

  // Use form hook for form management
  const {
    title,
    body,
    loading,
    errors,
    setTitle,
    setBody,
    setLoading,
    resetForm,
    validateForm,
    getFormData,
    isFormValid,
    hasChanges,
    titleLength,
    bodyLength,
    titleRemaining,
    bodyRemaining,
    isTitleValid,
    isBodyValid,
  } = useQuestionForm();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const formData = getFormData();
      const payload = { ...formData };

      if (videoId) {
        payload.videoId = videoId;
      }

      const result = await createQuestion(payload);

      if (result.success) {
        resetForm();
        navigate(videoId ? `/questions/video/${videoId}` : "/questions");
      }
    } catch (error) {
      console.error("Failed to post question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?",
        )
      ) {
        navigate("/questions");
      }
    } else {
      navigate("/questions");
    }
  };

  if (!isSignedIn) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 animate-fadeIn"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <FaQuestionCircle
            className="inline-block mr-3"
            style={{ color: "#2563eb" }}
          />
          Ask a Question
        </h1>

        {videoId && (
          <div
            className="p-4 md:p-5 rounded-xl mb-6 flex items-center gap-3 border-2 animate-slideDown"
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              borderColor: "#93c5fd",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              }}
            >
              <FaVideo
                className="w-5 h-5 md:w-6 md:h-6"
                style={{ color: "white" }}
              />
            </div>
            <p
              className="text-sm md:text-base font-semibold"
              style={{ color: "#1e40af" }}
            >
              Asking about a specific video
            </p>
          </div>
        )}

        <div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10 animate-fadeIn"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="block text-sm md:text-base font-semibold"
                  style={{ color: "#374151" }}
                >
                  Question Title
                </label>
                <span
                  className={`text-xs font-medium ${
                    titleRemaining < 20 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {titleLength}/200
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question? Be specific."
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm ${
                  errors.title
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
              {errors.title ? (
                <div className="flex items-center gap-2 mt-2">
                  <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600">{errors.title}</p>
                </div>
              ) : (
                <p
                  className="text-xs md:text-sm mt-2"
                  style={{ color: "#9ca3af" }}
                >
                  Be specific and imagine you're asking a question to another
                  person
                </p>
              )}
            </div>

            {/* Body Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="block text-sm md:text-base font-semibold"
                  style={{ color: "#374151" }}
                >
                  Question Body
                </label>
                <span
                  className={`text-xs font-medium ${
                    bodyRemaining < 100 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {bodyLength}/5000
                </span>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide more details about your question..."
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm resize-none ${
                  errors.body
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                rows={10}
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
              {errors.body ? (
                <div className="flex items-center gap-2 mt-2">
                  <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600">{errors.body}</p>
                </div>
              ) : (
                <p
                  className="text-xs md:text-sm mt-2"
                  style={{ color: "#9ca3af" }}
                >
                  Include all the information someone would need to answer your
                  question
                </p>
              )}
            </div>

            {/* Form Validation Summary */}
            {(errors.title || errors.body) && (
              <div
                className="p-4 rounded-lg border-l-4 border-red-400"
                style={{ background: "#fef2f2" }}
              >
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm font-medium text-red-800">
                    Please fix the following errors:
                  </p>
                </div>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {errors.title && <li>{errors.title}</li>}
                  {errors.body && <li>{errors.body}</li>}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{
                  background:
                    loading || !isFormValid()
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  if (!loading && isFormValid())
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  if (!loading && isFormValid())
                    e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  "Post Question"
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
