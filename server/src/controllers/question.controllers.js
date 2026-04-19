import { Question } from "../models/question.models.js";
import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Answer } from "../models/answer.models.js";
import { clerkClient } from "@clerk/express";

const createQuestion = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  const { videoId, title, body } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const username = clerkUser.username || clerkUser.firstName || "Anonymous";

  if ([title, body].some((field) => !field || field?.trim() === "")) {
    throw new ApiError(400, "title and body are required.");
  }

  // Verify video exists if provided
  if (videoId) {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
  }

  const question = await Question.create({
    video: videoId,
    askedBy: userId,
    askedByUsername: username,
    title,
    body,
  });

  const populatedQuestion = await Question.findById(question._id).populate(
    "video",
    "title",
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { question: populatedQuestion },
        "Question created successfully",
      ),
    );
});

const getQuestionsByVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const questions = await Question.find({ video: videoId })
    .populate("acceptedAnswer")
    .sort({ createdAt: -1 });

  // get answer count for every question
  const questionWithAnswerCount = await Promise.all(
    questions.map(async (question) => {
      const answerCount = await Answer.countDocuments({
        question: question._id,
      });

      return {
        ...question.toObject(),
        answerCount,
      };
    }),
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { questions: questionWithAnswerCount },
        "Questions fetched successfully",
      ),
    );
});

const getQuestionById = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  if (!questionId) {
    throw new ApiError(400, "Question ID is required");
  }

  const question = await Question.findById(questionId)
    .populate("video", "title thumbnail channelTitle course")
    .populate("acceptedAnswer");

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { question }, "Question fetched successfully"));
});

const updateQuestion = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  const { questionId } = req.params;
  const { title, body } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!questionId) {
    throw new ApiError(400, "Question ID is required");
  }

  if (!title && !body) {
    throw new ApiError(400, "At least one field (title or body) is required");
  }

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  if (question.askedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "user can only edit his or her own question");
  }

  const updatedQuestion = await Question.findByIdAndUpdate(
    questionId,
    {
      $set: { title, body },
    },
    { new: true },
  ).populate("video", "title");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        question: updatedQuestion,
      },
      "Question updated successfully",
    ),
  );
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { questionId } = req.params;

  if (!questionId) {
    throw new ApiError(400, "Question ID is required");
  }

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  // only can delete own question
  if (question.askedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "user can only delete his or her own questions");
  }

  const deletedQuestion = await Question.findByIdAndDelete(questionId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedQuestion,
      },
      "Question deleted successfully",
    ),
  );
});

const upvoteQuestion = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { questionId } = req.params;

  if (!questionId) {
    throw new ApiError(400, "Question ID is required");
  }

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  // if already upvoted
  const hasUpvoted = question.upvotes.includes(userId);
  const hasDownvoted = question.downvotes.includes(userId);

  if (hasUpvoted) {
    // Remove upvote
    question.upvotes = question.upvotes.filter(
      (id) => id.toString() !== userId.toString(),
    );
  } else {
    // Add upvote and remove downvote if exist
    question.upvotes.push(userId);
    if (hasDownvoted) {
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
  }

  await question.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { question }, "Vote updated successfully"));
});

const downvoteQuestion = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { questionId } = req.params;

  if (!questionId) {
    throw new ApiError(400, "Question ID is required");
  }

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  // check if already downvoted

  const hasUpvoted = question.upvotes.includes(userId);
  const hasDownvoted = question.downvotes.includes(userId);

  if (hasDownvoted) {
    // Remove downvote
    question.downvotes = question.downvotes.filter(
      (id) => id.toString() !== userId.toString(),
    );
  } else {
    // Add downvote and remove upvote if exist
    question.downvotes.push(userId);
    if (hasUpvoted) {
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
  }

  await question.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        question,
      },
      "Vote updated successfully",
    ),
  );
});

const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find()
    .populate("video", "title")
    .populate("acceptedAnswer")
    .sort({ createdAt: -1 });

  // also get answer count for each question

  const questionWithAnswerCount = await Promise.all(
    questions.map(async (question) => {
      const answerCount = await Answer.countDocuments({
        question: question._id,
      });
      return {
        ...question.toObject(),
        answerCount,
      };
    }),
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { questions: questionWithAnswerCount },
        "All questions fetched successfully",
      ),
    );
});

export {
  createQuestion,
  getQuestionsByVideo,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
  getAllQuestions,
};
