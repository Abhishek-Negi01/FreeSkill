import { useState, useEffect } from "react";
import { questionService } from "../../api/services/questions";
import { answerService } from "../../api/services/answers";
import toast from "react-hot-toast";

const useQuestions = (videoId = null) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [error, setError] = useState(null);

  // Fetch questions (all or by video)
  const fetchQuestions = async () => {
    setFetchingQuestions(true);
    try {
      let res;
      if (videoId) {
        res = await questionService.getByVideo(videoId);
      } else {
        res = await questionService.getAll();
      }
      setQuestions(res.data.data.questions);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load questions");
      toast.error("Failed to load questions");
    } finally {
      setFetchingQuestions(false);
    }
  };

  // Create question
  const createQuestion = async (questionData) => {
    setLoading(true);
    try {
      const res = await questionService.create(questionData);
      setQuestions((prev) => [res.data.data.question, ...prev]);
      toast.success(res?.data?.message || "Question posted successfully!");
      return { success: true, question: res.data.data.question };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to post question";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update question
  const updateQuestion = async (questionId, questionData) => {
    setLoading(true);
    try {
      const res = await questionService.update(questionId, questionData);
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? res.data.data.question : q)),
      );
      toast.success(res?.data?.message || "Question updated successfully!");
      return { success: true, question: res.data.data.question };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update question";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete question
  const deleteQuestion = async (questionId) => {
    try {
      const res = await questionService.delete(questionId);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      toast.success(res?.data?.message || "Question deleted successfully!");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete question";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Upvote question
  const upvoteQuestion = async (questionId) => {
    try {
      const res = await questionService.upvote(questionId);
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? res.data.data.question : q)),
      );
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to upvote";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Downvote question
  const downvoteQuestion = async (questionId) => {
    try {
      const res = await questionService.downvote(questionId);
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? res.data.data.question : q)),
      );
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to downvote";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Load questions on mount or when videoId changes
  useEffect(() => {
    fetchQuestions();
  }, [videoId]);

  return {
    // Data
    questions,
    loading,
    fetchingQuestions,
    error,

    // Actions
    createQuestion,
    updateQuestion,
    deleteQuestion,
    upvoteQuestion,
    downvoteQuestion,

    // Utils
    fetchQuestions,
    refetch: fetchQuestions,
  };
};

export default useQuestions;
