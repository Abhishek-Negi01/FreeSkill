import React from "react";
import { useUser } from "@clerk/clerk-react";
import useQuestions from "../../hooks/api/useQuestions";
import useQuestionSearch from "../../hooks/ui/useQuestionSearch";
import { Link } from "react-router-dom";
import {
  FaCalendar,
  FaThumbsUp,
  FaUser,
  FaSearch,
  FaQuestionCircle,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";

const QuestionList = () => {
  const { user } = useUser();

  // Use existing useQuestions hook (no videoId = get all questions)
  const { questions, fetchingQuestions: loading, error } = useQuestions();

  // Use search hook for filtering
  const {
    searchQuery,
    setSearchQuery,
    filteredQuestions,
    clearSearch,
    isSearching,
    hasResults,
    resultCount,
  } = useQuestionSearch(questions);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium" style={{ color: "#6b7280" }}>
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 lg:p-8 min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
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
              Community Questions
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#6b7280" }}>
              {searchQuery
                ? `${resultCount} of ${questions.length} questions`
                : `${questions.length} questions from the community`}
              {isSearching && (
                <span className="ml-2 text-xs">
                  <div className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </span>
              )}
            </p>
          </div>
          {user && (
            <Link
              to="/ask"
              className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FaPlus className="w-4 h-4" />
              Ask Question
            </Link>
          )}
        </div>

        {/* Search */}
        {questions.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <div className="relative max-w-md">
              <div
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: "#9ca3af" }}
              >
                <FaSearch className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                style={{ background: "white", color: "#1f2937" }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4 animate-fadeIn">
          {!hasResults ? (
            <div
              className="bg-white rounded-xl shadow-lg p-12 text-center"
              style={{ border: "1px solid #e5e7eb" }}
            >
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                }}
              >
                <FaQuestionCircle
                  className="w-10 h-10"
                  style={{ color: "#3b82f6" }}
                />
              </div>
              <h3
                className="text-xl md:text-2xl font-bold mb-2"
                style={{ color: "#374151" }}
              >
                {searchQuery ? "No questions found" : "No questions yet"}
              </h3>
              <p
                className="mb-6 text-sm md:text-base"
                style={{ color: "#6b7280" }}
              >
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Be the first to ask a question!"}
              </p>
              {searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    color: "white",
                  }}
                >
                  Clear Search
                </button>
              ) : (
                user && (
                  <Link
                    to="/ask"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <FaPlus className="w-4 h-4" />
                    Ask Question
                  </Link>
                )
              )}
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <Link
                key={question._id}
                to={`/questions/${question._id}`}
                className="block bg-white rounded-xl shadow-lg p-5 md:p-6 transition-all duration-300 hover:shadow-2xl"
                style={{ border: "1px solid #e5e7eb" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <FaThumbsUp
                        className="w-4 h-4 md:w-5 md:h-5"
                        style={{ color: "#10b981" }}
                      />
                      <span
                        className="text-sm md:text-base font-bold"
                        style={{ color: "#374151" }}
                      >
                        {question.upvotes?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-lg md:text-xl mb-2 hover:text-blue-600 transition line-clamp-2"
                      style={{ color: "#1f2937" }}
                    >
                      {question.title}
                    </h3>
                    <p
                      className="text-sm md:text-base line-clamp-2 mb-3"
                      style={{ color: "#6b7280" }}
                    >
                      {question.body}
                    </p>

                    <div
                      className="flex flex-wrap items-center gap-4 text-xs md:text-sm"
                      style={{ color: "#9ca3af" }}
                    >
                      <span className="flex items-center gap-1.5">
                        <FaUser className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="font-medium">
                          {question.askedByUsername || "Anonymous"}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BsChatDots className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="font-medium">
                          {question.answers?.length || 0} answers
                        </span>
                      </span>
                      {question.acceptedAnswer && (
                        <span
                          className="flex items-center gap-1.5 font-medium"
                          style={{ color: "#10b981" }}
                        >
                          <FaCheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                          Answered
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <FaCalendar className="w-3 h-3 md:w-4 md:h-4" />
                        {formatDate(question.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
