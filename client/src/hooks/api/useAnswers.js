import { useState } from "react";
import { answerService } from "../../api/services/answers";
import toast from "react-hot-toast";

const useAnswers = () => {
  const [loading, setLoading] = useState(false);

  // Create answer
  const createAnswer = async (questionId, body) => {
    setLoading(true);
    try {
      const response = await answerService.create({ questionId, body });
      toast.success("Answer posted!");
      return { success: true, answer: response.data.data.answer };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post answer");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Vote on answer
  const voteAnswer = async (answerId, type) => {
    try {
      const response =
        type === "up"
          ? await answerService.upvote(answerId)
          : await answerService.downvote(answerId);
      toast.success("Voted!");
      return { success: true, answer: response.data.data.answer };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to vote");
      return { success: false };
    }
  };

  // Accept answer
  const acceptAnswer = async (answerId) => {
    try {
      const response = await answerService.accept(answerId);
      toast.success(response.data.message);
      return { success: true, question: response.data.data.question };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept answer");
      return { success: false };
    }
  };

  // Update answer
  const updateAnswer = async (answerId, body) => {
    try {
      const response = await answerService.update(answerId, { body });
      toast.success("Answer updated!");
      return { success: true, answer: response.data.data.answer };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update");
      return { success: false };
    }
  };

  // Delete answer
  const deleteAnswer = async (answerId) => {
    try {
      await answerService.delete(answerId);
      toast.success("Answer deleted!");
      return { success: true };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
      return { success: false };
    }
  };

  return {
    loading,
    createAnswer,
    voteAnswer,
    acceptAnswer,
    updateAnswer,
    deleteAnswer,
  };
};

export default useAnswers;
