import React, { useEffect, useState } from "react";
import { bookmarkServices } from "../api/services/bookmarks.js";
import { Link } from "react-router-dom";
import { BiUpvote } from "react-icons/bi";
import { BsChatDots, BsBookmarkFill } from "react-icons/bs";
import { FaCheckCircle, FaBookmark, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await bookmarkServices.getAll();
      setBookmarks(response.data.data.bookmarkedQuestions);
    } catch (error) {
      toast.error("Failed to load bookmarks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (questionId) => {
    try {
      await bookmarkServices.toggle(questionId);
      setBookmarks(bookmarks.filter((q) => q._id !== questionId));
      toast.success("Bookmark removed");
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
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
            Loading bookmarks...
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <FaBookmark
              className="inline-block mr-3"
              style={{ color: "#2563eb" }}
            />
            Bookmarked Questions
          </h1>
          <p className="text-sm md:text-base" style={{ color: "#6b7280" }}>
            Your saved questions for quick access
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div
            className="bg-white rounded-xl shadow-lg p-12 text-center animate-fadeIn"
            style={{ border: "1px solid #e5e7eb" }}
          >
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              }}
            >
              <BsBookmarkFill
                className="w-10 h-10"
                style={{ color: "#f59e0b" }}
              />
            </div>
            <h3
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: "#374151" }}
            >
              No bookmarks yet
            </h3>
            <p
              className="mb-6 text-sm md:text-base"
              style={{ color: "#6b7280" }}
            >
              Start bookmarking questions to save them for later
            </p>
            <Link
              to="/questions"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
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
              Browse Questions
            </Link>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {bookmarks.map((question) => (
              <div
                key={question._id}
                className="bg-white rounded-xl shadow-lg p-5 md:p-6 transition-all duration-300 hover:shadow-2xl"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <Link
                    to={`/questions/${question._id}`}
                    className="flex-1 min-w-0"
                  >
                    <h3
                      className="text-lg md:text-xl font-bold mb-2 hover:text-blue-600 transition line-clamp-2"
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
                      className="flex flex-wrap gap-4 text-xs md:text-sm"
                      style={{ color: "#9ca3af" }}
                    >
                      <span className="flex items-center gap-1.5">
                        <BiUpvote
                          className="w-4 h-4"
                          style={{ color: "#10b981" }}
                        />
                        <span className="font-medium">
                          {question.upvotes?.length || 0} upvotes
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BsChatDots
                          className="w-4 h-4"
                          style={{ color: "#3b82f6" }}
                        />
                        <span className="font-medium">
                          {question.answers?.length || 0} answers
                        </span>
                      </span>
                      {question.acceptedAnswer && (
                        <span
                          className="flex items-center gap-1.5 font-medium"
                          style={{ color: "#10b981" }}
                        >
                          <FaCheckCircle className="w-4 h-4" />
                          Answered
                        </span>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={() => handleRemoveBookmark(question._id)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 shadow-lg hover:shadow-xl lg:self-start whitespace-nowrap"
                    style={{
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                    }}
                    title="Remove bookmark"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <FaTrash className="w-3 h-3 md:w-4 md:h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
