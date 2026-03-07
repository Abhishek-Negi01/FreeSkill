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
  FaThumbsDown,
  FaThumbsUp,
  FaUser,
} from "react-icons/fa";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!question) {
    return <div className="p-6">Question not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        to="/questions"
        className="text-blue-600 hover:underline mb-4 flex items-center gap-2"
      >
        <FaArrowLeft /> Back to Questions
      </Link>

      {/* question */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">
          {question.body}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 ">
          <span className="flex items-center gap-1">
            <FaUser />
            {question.askedBy?.fullname || question.askedBy?.username}
          </span>
          <span className="flex items-center gap-1">
            <FaCalendar />
            {new Date(question.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpvoteQuestion}
              className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-green-50"
            >
              <FaThumbsUp className="text-green-600" />
              {question.upvotes?.length || 0}
            </button>
            <button
              onClick={handleDownvoteQuestion}
              className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-red-50"
            >
              <FaThumbsDown className="text-red-600" />
              {question.downvotes?.length || 0}
            </button>
          </div>

          {user && user._id === question.askedBy?._id && (
            <button
              onClick={handleDeleteQuestion}
              className="ml-auto text-red-600 hover:text-red-800 text-sm"
            >
              Delete Question
            </button>
          )}
        </div>
      </div>

      {/* answer */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
        </h2>

        <div className="space-y-4">
          {answers.map((answer) => {
            const acceptedId =
              typeof question.acceptedAnswer === "string"
                ? question.acceptedAnswer
                : question.acceptedAnswer?._id;

            return (
              <div
                key={`${answer._id}-${acceptedId}`}
                className={`bg-white p-6 rounded-lg shadow-md ${
                  acceptedId === answer._id ? "border-2 border-green-500" : ""
                }`}
              >
                {acceptedId === answer._id && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                    <FaCheckCircle />
                    Accepted Answer
                  </div>
                )}

                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {answer.body}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FaUser />
                    {answer.answeredBy?.fullname || answer.answeredBy?.username}
                  </span>

                  <span className="flex items-center gap-1">
                    <FaCalendar />
                    {new Date(answer.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpvoteAnswer(answer._id)}
                      className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-green-50"
                    >
                      <FaThumbsUp className="text-green-600" />
                      {answer.upvotes?.length || 0}
                    </button>
                    <button
                      onClick={() => handleDownvoteAnswer(answer._id)}
                      className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-red-50"
                    >
                      <FaThumbsDown className="text-red-600" />
                      {answer.downvotes?.length || 0}
                    </button>
                  </div>

                  {user &&
                    user._id === question.askedBy?._id &&
                    acceptedId !== answer._id && (
                      <button
                        onClick={() => handleAcceptAnswer(answer._id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Accept Answer
                      </button>
                    )}

                  {user && user._id === answer.answeredBy?._id && (
                    <button
                      onClick={() => handleDeleteAnswer(answer._id)}
                      className="ml-auto text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* answer form */}
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              rows={6}
              required
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? "Posting" : "Post Answer"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>{" "}
            to post an answer
          </p>
        </div>
      )}
    </div>
  );
};
export default QuestionDetail;
