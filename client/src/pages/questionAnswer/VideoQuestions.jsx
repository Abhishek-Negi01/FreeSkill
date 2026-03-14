import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { questionService } from "../../api/services/questions";
import {
  FaArrowLeft,
  FaCalendar,
  FaThumbsDown,
  FaThumbsUp,
  FaUser,
  FaQuestionCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import toast from "react-hot-toast";

const VideoQuestions = () => {
  const { videoId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const response = await questionService.getByVideo(videoId);
      setQuestions(response.data.data.questions);
    } catch (error) {
      toast.error("Failed to load questions");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [videoId]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="spinner"
            style={{
              width: "48px",
              height: "48px",
              borderWidth: "4px",
              borderColor: "#3b82f6",
              borderTopColor: "transparent",
            }}
          ></div>
          <p className="mt-4 text-sm font-medium" style={{ color: "#6b7280" }}>
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          to={-1}
          className="inline-flex items-center gap-2 mb-6 text-sm md:text-base font-medium transition-all hover:gap-3"
          style={{ color: "#3b82f6" }}
        >
          <FaArrowLeft /> Back to Video
        </Link>

        <h1
          className="text-2xl md:text-3xl font-bold mb-6 gradient-text animate-fadeIn"
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
          Video Questions
        </h1>

        <div className="space-y-4 animate-fadeIn">
          {questions.length === 0 ? (
            <div className="card p-12 text-center">
              <FaQuestionCircle
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: "#d1d5db" }}
              />
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "#374151" }}
              >
                No questions yet
              </h3>
              <p className="mb-6" style={{ color: "#6b7280" }}>
                Be the first to ask a question about this video!
              </p>
              <Link to={`/ask?videoId=${videoId}`} className="btn btn-primary">
                Ask First Question
              </Link>
            </div>
          ) : (
            questions.map((question) => (
              <Link
                key={question._id}
                to={`/questions/${question._id}`}
                className="card p-4 md:p-5 block hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <FaThumbsUp
                        className="w-4 h-4"
                        style={{ color: "#10b981" }}
                      />
                      <span
                        className="text-sm font-bold"
                        style={{ color: "#374151" }}
                      >
                        {question.upvotes?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-lg mb-2 hover:text-blue-600 transition"
                      style={{ color: "#1f2937" }}
                    >
                      {question.title}
                    </h3>
                    <p
                      className="text-sm line-clamp-2 mb-3"
                      style={{ color: "#6b7280" }}
                    >
                      {question.body}
                    </p>

                    <div
                      className="flex flex-wrap items-center gap-4 text-xs"
                      style={{ color: "#9ca3af" }}
                    >
                      <span className="flex items-center gap-1">
                        <FaUser />
                        {question.askedBy?.fullname ||
                          question.askedBy?.username}
                      </span>
                      <span className="flex items-center gap-1">
                        <BsChatDots />
                        {question.answers?.length || 0} answers
                      </span>
                      {question.acceptedAnswer && (
                        <span
                          className="flex items-center gap-1"
                          style={{ color: "#10b981" }}
                        >
                          <FaCheckCircle />
                          Answered
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FaCalendar />
                        {new Date(question.createdAt).toLocaleDateString()}
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

export default VideoQuestions;
