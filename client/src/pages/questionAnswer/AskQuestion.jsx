import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { questionService } from "../../api/services/questions";
import toast from "react-hot-toast";
import { FaVideo, FaQuestionCircle } from "react-icons/fa";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { title, body };
      if (videoId) {
        payload.videoId = videoId;
      }
      const response = await questionService.create(payload);
      toast.success(response?.data?.message || "Question posted successfully!");
      navigate(videoId ? `/questions/video/${videoId}` : "/questions");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post question");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
            <div>
              <label
                className="block text-sm md:text-base font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                Question Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question? Be specific."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
              <p
                className="text-xs md:text-sm mt-2"
                style={{ color: "#9ca3af" }}
              >
                Be specific and imagine you're asking a question to another
                person
              </p>
            </div>

            <div>
              <label
                className="block text-sm md:text-base font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                Question Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide more details about your question..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                rows={10}
                required
                disabled={loading}
                style={{ background: "white", color: "#1f2937" }}
              />
              <p
                className="text-xs md:text-sm mt-2"
                style={{ color: "#9ca3af" }}
              >
                Include all the information someone would need to answer your
                question
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{
                  background: loading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  if (!loading)
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
                onClick={() => navigate("/questions")}
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
