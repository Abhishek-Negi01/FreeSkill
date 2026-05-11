import { useState, useEffect } from "react";
import { questionService } from "../../api/services/questions";
import { answerService } from "../../api/services/answers";
import { bookmarkServices } from "../../api/services/bookmarks";
import toast from "react-hot-toast";

const useQuestionDetail = (questionId) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch question
  const fetchQuestion = async () => {
    try {
      const response = await questionService.getById(questionId);
      setQuestion(response.data.data.question);
    } catch (error) {
      toast.error("Failed to load question");
      console.error(error);
    }
  };

  // Fetch answers
  const fetchAnswers = async () => {
    try {
      const response = await answerService.getByQuestion(questionId);
      setAnswers(response.data.data.answers);
    } catch (error) {
      toast.error("Failed to load answers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Vote on question
  const voteQuestion = async (type) => {
    try {
      const response =
        type === "up"
          ? await questionService.upvote(questionId)
          : await questionService.downvote(questionId);
      setQuestion(response.data.data.question);
      toast.success("Voted!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to vote");
    }
  };

  // Update question
  const updateQuestion = async (data) => {
    try {
      const response = await questionService.update(questionId, data);
      setQuestion(response.data.data.question);
      toast.success("Question updated!");
      return { success: true };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update");
      return { success: false };
    }
  };

  // Delete question
  const deleteQuestion = async () => {
    try {
      await questionService.delete(questionId);
      toast.success("Question deleted!");
      return { success: true };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
      return { success: false };
    }
  };

  // Toggle bookmark
  const toggleBookmark = async () => {
    try {
      await bookmarkServices.toggle(questionId);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Bookmark removed" : "Bookmark added");
    } catch (error) {
      toast.error("Failed to toggle bookmark");
    }
  };

  useEffect(() => {
    if (questionId) {
      fetchQuestion();
      fetchAnswers();
    }
  }, [questionId]);

  return {
    // Data
    question,
    answers,
    loading,
    isBookmarked,

    // Actions
    voteQuestion,
    updateQuestion,
    deleteQuestion,
    toggleBookmark,
    setAnswers,
    setQuestion,

    // Utils
    refetch: () => {
      fetchQuestion();
      fetchAnswers();
    },
  };
};

export default useQuestionDetail;
