import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { questionService } from "../../api/services/questions";
import { answerService } from "../../api/services/answers";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaCalendar,
  FaCheckCircle,
  FaEdit,
  FaThumbsDown,
  FaThumbsUp,
  FaUser,
  FaVideo,
  FaTrash,
} from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { bookmarkServices } from "../../api/services/bookmarks.js";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editQuestionTitle, setEditQuestionTitle] = useState("");
  const [editQuestionBody, setEditQuestionBody] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerBody, setEditAnswerBody] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Helper to get acceptedAnswer ID (handles both string and object)
  const getAcceptedAnswerId = () => {
    if (!question?.acceptedAnswer) return null;
    return typeof question.acceptedAnswer === "string"
      ? question.acceptedAnswer
      : question.acceptedAnswer._id;
  };

  const fetchQuestion = async () => {
    try {
      const response = await questionService.getById(id);
      setQuestion(response.data.data.question);
    } catch (error) {
      toast.error("Failed to load question");
      console.log(error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await answerService.getByQuestion(id);
      setAnswers(response.data.data.answers);
    } catch (error) {
      toast.error("Failed to load answers");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  const handleUpvoteQuestion = async () => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }
    try {
      const response = await questionService.upvote(id);
      setQuestion(response.data.data.question);
      toast.success("Voted!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to vote");
    }
  };

  const handleDownvoteQuestion = async () => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    try {
      const response = await questionService.downvote(id);
      setQuestion(response.data.data.question);
      toast.success("Voted!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to vote");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!confirm("Delete this question?")) return;

    try {
      await questionService.delete(id);
      toast.success("Question deleted!");
      navigate("/questions");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to answer");
      return;
    }

    setSubmitting(true);
    try {
      const response = await answerService.create({
        questionId: id,
        body: answerBody,
      });
      setAnswers([...answers, response.data.data.answer]);
      setAnswerBody("");
      toast.success("Answer posted!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteAnswer = async (answerId) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    try {
      const response = await answerService.upvote(answerId);
      setAnswers(
        answers.map((a) =>
          a._id === answerId ? response.data.data.answer : a,
        ),
      );
      toast.success("Voted!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to vote");
    }
  };

  const handleDownvoteAnswer = async (answerId) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    try {
      const response = await answerService.downvote(answerId);
      setAnswers(
        answers.map((a) =>
          a._id === answerId ? response.data.data.answer : a,
        ),
      );
      toast.success("Voted!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to vote");
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      const response = await answerService.accept(answerId);

      // console.log("Backend response:", response.data.data);
      // console.log(
      //   "Accepted answer ID:",
      //   response.data.data.question?.acceptedAnswer,
      // );
      setQuestion(response.data.data.question);
      toast.success("Answer accepted!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept answer");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!confirm("Delete this answer?")) {
      return;
    }

    try {
      await answerService.delete(answerId);
      setAnswers(answers.filter((a) => a._id !== answerId));
      toast.success("Answer deleted!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  const handleEditQuestion = () => {
    setEditingQuestion(true);
    setEditQuestionTitle(question.title);
    setEditQuestionBody(question.body);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();

    try {
      const response = await questionService.update(id, {
        title: editQuestionTitle,
        body: editQuestionBody,
      });
      setQuestion(response.data.data.question);
      setEditingQuestion(false);
      toast.success("Question updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update");
    }
  };

  const handleCancelEditQuestion = () => {
    setEditingQuestion(false);
    setEditQuestionTitle("");
    setEditQuestionBody("");
  };

  const handleEditAnswer = (answer) => {
    setEditingAnswerId(answer._id);
    setEditAnswerBody(answer.body);
  };

  const handleUpdateAnswer = async (answerId) => {
    try {
      const response = await answerService.update(answerId, {
        body: editAnswerBody,
      });
      setAnswers(
        answers.map((a) =>
          a._id === answerId ? response.data.data.answer : a,
        ),
      );
      setEditingAnswerId(null);
      setEditAnswerBody("");
      toast.success("Answer updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update");
    }
  };

  const handleCancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditAnswerBody("");
  };

  const handleToggleBookmark = async () => {
    try {
      await bookmarkServices.toggle(id);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Bookmark removed" : "Bookmark added");
    } catch (error) {
      toast.error("Failed to toggle bookmark");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!question) {
    return <div className="p-6">Question not found</div>;
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <Link
          to="/questions"
          className="inline-flex items-center gap-2 mb-6 text-sm md:text-base font-semibold transition-all hover:gap-3"
          style={{ color: "#3b82f6" }}
        >
          <FaArrowLeft /> Back to Questions
        </Link>

        {/* Question Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 animate-fadeIn"
          style={{ border: "1px solid #e5e7eb" }}
        >
          {editingQuestion ? (
            <form onSubmit={handleUpdateQuestion} className="space-y-5">
              <div>
                <label
                  className="block font-semibold mb-2 text-sm"
                  style={{ color: "#374151" }}
                >
                  Question Title
                </label>
                <input
                  type="text"
                  value={editQuestionTitle}
                  onChange={(e) => setEditQuestionTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg md:text-xl font-bold"
                  placeholder="Question title..."
                  required
                  style={{ background: "white", color: "#1f2937" }}
                />
              </div>
              <div>
                <label
                  className="block font-semibold mb-2 text-sm"
                  style={{ color: "#374151" }}
                >
                  Question Body
                </label>
                <textarea
                  value={editQuestionBody}
                  onChange={(e) => setEditQuestionBody(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                  rows={8}
                  placeholder="Question details..."
                  required
                  style={{ background: "white", color: "#1f2937" }}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEditQuestion}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    color: "white",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <h1
                  className="text-2xl md:text-3xl lg:text-4xl font-bold flex-1"
                  style={{ color: "#1f2937" }}
                >
                  {question.title}
                </h1>
                <button
                  onClick={handleToggleBookmark}
                  className="p-3 rounded-lg hover:bg-gray-100 transition-all hover:scale-110 shrink-0"
                  title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                    <BsBookmarkFill className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                  ) : (
                    <BsBookmark className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  )}
                </button>
              </div>

              {question.video && (
                <div
                  className="p-4 md:p-5 rounded-xl mb-6 border-2 animate-slideDown"
                  style={{
                    background:
                      "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                    borderColor: "#93c5fd",
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    {question.video.thumbnail && (
                      <img
                        src={question.video.thumbnail}
                        alt={question.video.title}
                        className="w-full sm:w-32 md:w-40 h-20 md:h-24 object-cover rounded-lg shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FaVideo style={{ color: "#3b82f6" }} />
                        <span
                          className="text-sm md:text-base font-semibold"
                          style={{ color: "#1e40af" }}
                        >
                          Related Video
                        </span>
                      </div>
                      <p
                        className="text-sm md:text-base font-medium mb-1"
                        style={{ color: "#1f2937" }}
                      >
                        {question.video.title}
                      </p>
                      {question.video.channelTitle && (
                        <p
                          className="text-xs md:text-sm"
                          style={{ color: "#6b7280" }}
                        >
                          Channel: {question.video.channelTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <p
                className="text-sm md:text-base lg:text-lg mb-6 whitespace-pre-wrap leading-relaxed"
                style={{ color: "#374151" }}
              >
                {question.body}
              </p>

              <div
                className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm mb-6"
                style={{ color: "#6b7280" }}
              >
                <span className="flex items-center gap-1.5">
                  <FaUser />
                  <span className="font-medium">
                    {question.askedBy?.fullname || question.askedBy?.username}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendar />
                  {new Date(question.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUpvoteQuestion}
                    className="flex items-center gap-1.5 px-4 py-2.5 border-2 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{ borderColor: "#d1fae5", background: "#f0fdf4" }}
                  >
                    <FaThumbsUp style={{ color: "#10b981" }} />
                    <span
                      className="text-sm md:text-base"
                      style={{ color: "#065f46" }}
                    >
                      {question.upvotes?.length || 0}
                    </span>
                  </button>
                  <button
                    onClick={handleDownvoteQuestion}
                    className="flex items-center gap-1.5 px-4 py-2.5 border-2 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{ borderColor: "#fecaca", background: "#fef2f2" }}
                  >
                    <FaThumbsDown style={{ color: "#ef4444" }} />
                    <span
                      className="text-sm md:text-base"
                      style={{ color: "#991b1b" }}
                    >
                      {question.downvotes?.length || 0}
                    </span>
                  </button>
                </div>

                {user && user._id === question.askedBy?._id && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleEditQuestion}
                      className="flex items-center gap-1.5 text-sm md:text-base font-semibold transition-colors hover:underline"
                      style={{ color: "#3b82f6" }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={handleDeleteQuestion}
                      className="flex items-center gap-1.5 text-sm md:text-base font-semibold transition-colors hover:underline"
                      style={{ color: "#ef4444" }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2
            className="text-xl md:text-2xl lg:text-3xl font-bold mb-6"
            style={{ color: "#1f2937" }}
          >
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          <div className="space-y-4">
            {answers.map((answer) => {
              const acceptedId =
                typeof question.acceptedAnswer === "string"
                  ? question.acceptedAnswer
                  : question.acceptedAnswer?._id;
              const isEditing = editingAnswerId === answer._id;
              const isAccepted = acceptedId === answer._id;

              return (
                <div
                  key={`${answer._id}-${acceptedId}`}
                  className="bg-white rounded-xl shadow-lg p-5 md:p-6 animate-fadeIn"
                  style={{
                    border: isAccepted
                      ? "2px solid #10b981"
                      : "1px solid #e5e7eb",
                    background: isAccepted
                      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                      : "white",
                  }}
                >
                  {isAccepted && (
                    <div
                      className="flex items-center gap-2 mb-4 text-sm md:text-base font-bold"
                      style={{ color: "#10b981" }}
                    >
                      <FaCheckCircle className="w-5 h-5" />
                      Accepted Answer
                    </div>
                  )}

                  {isEditing ? (
                    <div className="space-y-4">
                      <textarea
                        value={editAnswerBody}
                        onChange={(e) => setEditAnswerBody(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                        rows={8}
                        required
                        style={{ background: "white", color: "#1f2937" }}
                      />
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleUpdateAnswer(answer._id)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                          style={{
                            background:
                              "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "white",
                          }}
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEditAnswer}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                          style={{
                            background:
                              "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                            color: "white",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        className="text-sm md:text-base lg:text-lg mb-6 whitespace-pre-wrap leading-relaxed"
                        style={{ color: "#374151" }}
                      >
                        {answer.body}
                      </p>

                      <div
                        className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm mb-4"
                        style={{ color: "#6b7280" }}
                      >
                        <span className="flex items-center gap-1.5">
                          <FaUser />
                          <span className="font-medium">
                            {answer.answeredBy?.fullname ||
                              answer.answeredBy?.username}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaCalendar />
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleUpvoteAnswer(answer._id)}
                            className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-2 rounded-lg font-semibold transition-all hover:scale-105"
                            style={{
                              borderColor: "#d1fae5",
                              background: "#f0fdf4",
                            }}
                          >
                            <FaThumbsUp style={{ color: "#10b981" }} />
                            <span
                              className="text-sm"
                              style={{ color: "#065f46" }}
                            >
                              {answer.upvotes?.length || 0}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDownvoteAnswer(answer._id)}
                            className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-2 rounded-lg font-semibold transition-all hover:scale-105"
                            style={{
                              borderColor: "#fecaca",
                              background: "#fef2f2",
                            }}
                          >
                            <FaThumbsDown style={{ color: "#ef4444" }} />
                            <span
                              className="text-sm"
                              style={{ color: "#991b1b" }}
                            >
                              {answer.downvotes?.length || 0}
                            </span>
                          </button>

                          {user &&
                            user._id === question.askedBy?._id &&
                            !isAccepted && (
                              <button
                                onClick={() => handleAcceptAnswer(answer._id)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                  color: "white",
                                }}
                              >
                                <FaCheckCircle /> Accept
                              </button>
                            )}
                        </div>

                        {user && user._id === answer.answeredBy?._id && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditAnswer(answer)}
                              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
                              style={{ color: "#3b82f6" }}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAnswer(answer._id)}
                              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
                              style={{ color: "#ef4444" }}
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Answer Form */}
        {user ? (
          <div
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fadeIn"
            style={{ border: "1px solid #e5e7eb" }}
          >
            <h3
              className="text-xl md:text-2xl font-bold mb-4"
              style={{ color: "#1f2937" }}
            >
              Your Answer
            </h3>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                rows={8}
                placeholder="Write your answer here..."
                required
                disabled={submitting}
                style={{ background: "white", color: "#1f2937" }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{
                  background: submitting
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "white",
                }}
              >
                {submitting ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  "Post Answer"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div
            className="bg-white rounded-xl shadow-lg p-8 text-center"
            style={{ border: "1px solid #e5e7eb" }}
          >
            <p className="text-base md:text-lg" style={{ color: "#6b7280" }}>
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: "#3b82f6" }}
              >
                Login
              </Link>{" "}
              to post an answer
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
