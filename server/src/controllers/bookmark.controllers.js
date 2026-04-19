import { Question } from "../models/question.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Answer } from "../models/answer.models.js";
import { Bookmark } from "../models/bookmark.models.js";

const toggleBookmark = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  const { questionId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const existing = await Bookmark.findOne({ userId, questionId });
  if (existing) {
    await Bookmark.findByIdAndDelete(existing._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { bookmarked: false }, "Bookmark removed."));
  }

  await Bookmark.create({ userId, questionId });
  return res
    .status(200)
    .json(new ApiResponse(200, { bookmarked: true }, "Question bookmarked."));
});

const getBookmarkedQuestions = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized.");

  const bookmarks = await Bookmark.find({ userId }).populate({
    path: "questionId",
    populate: { path: "acceptedAnswer" },
  });

  const questions = await Promise.all(
    bookmarks.map(async (b) => {
      if (!b.questionId) return null;
      const answerCount = await Answer.countDocuments({
        question: b.questionId._id,
      });
      return { ...b.questionId.toObject(), answerCount };
    }),
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookmarkedQuestions: questions.filter(Boolean),
      },
      "Bookmarked questions fetched successfully.",
    ),
  );
});

export { toggleBookmark, getBookmarkedQuestions };
