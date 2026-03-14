import { Question } from "../models/question.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Answer } from "../models/answer.models.js";

/*
const bookmarkQuestion = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { questionId } = req.params();

  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const user = User.findById(userId);

  // check if already bookmarked
  const isBookmarked = await user.bookmarkedQuestions.includes(questionId);

  if (isBookmarked) {
    throw new ApiError(400, "Question already bookmarked");
  }

  user.bookmarkedQuestions.push(questionId);

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Question bookmarked successfully"));
});

const removeBookmark = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { questionId } = req.params();

  const user = await User.findById(userId);

  const isBookmarked = user.bookmarkedQuestions.includes(questionId);

  if (!isBookmarked) {
    throw new ApiError(400, "Question not bookmarked");
  }

  user.bookmarkedQuestions = user.bookmarkedQuestions.filter(
    (id) => id.toString() !== questionId.toString(),
  );

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Bookmark removed successfully"));
});
*/

const toggleBookmark = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { questionId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const user = await User.findById(userId);

  const isBookmarked = user.bookmarkedQuestions.includes(questionId);

  if (isBookmarked) {
    // Remove bookmark
    user.bookmarkedQuestions = user.bookmarkedQuestions.filter(
      (id) => id.toString() !== questionId.toString(),
    );
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, { bookmarked: false }, "Bookmark removed"));
  } else {
    // Add bookmark
    user.bookmarkedQuestions.push(questionId);
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, { bookmarked: true }, "Question bookmarked"));
  }
});

const getBookmarkedQuestions = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(userId).populate({
    path: "bookmarkedQuestions",
    populate: [
      {
        path: "askedBy",
        select: "username fullname",
      },
      {
        path: "acceptedAnswer",
      },
    ],
  });

  // Get answer counts for each question

  const bookmarkedQuestionsWithCounts = await Promise.all(
    user.bookmarkedQuestions.map(async (question) => {
      const answerCount = await Answer.countDocuments({
        question: question._id,
      });
      return {
        ...question.toObject(),
        answers: { length: answerCount },
      };
    }),
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { bookmarkedQuestions: bookmarkedQuestionsWithCounts },
        "Bookmarked questions fetched successfully",
      ),
    );
});

export { toggleBookmark, getBookmarkedQuestions };
