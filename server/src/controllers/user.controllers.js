import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.models.js";
import { Video } from "../models/video.models.js";
import { Question } from "../models/question.models.js";
import { Answer } from "../models/answer.models.js";
import { Bookmark } from "../models/bookmark.models.js";
import { Notification } from "../models/notification.models.js";
import { Comment } from "../models/comment.models.js";
import { clerkClient } from "@clerk/express";

const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { userId: req.auth.userId }, "Authenticated."));
});

const deleteMe = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const courses = await Course.find({ creator: userId });
  const courseIds = courses.map((c) => c._id);

  await Video.deleteMany({ course: { $in: courseIds } });
  await Course.deleteMany({ creator: userId });

  const questions = await Question.find({ askedBy: userId });
  const questionsIds = questions.map((q) => q._id);

  const userAnswers = await Answer.find({ answeredBy: userId });
  const userAnswerIds = userAnswers.map((a) => a._id);

  await Question.updateMany(
    { acceptedAnswer: { $in: userAnswerIds } },
    { $set: { acceptedAnswer: null } },
  );

  await Comment.deleteMany({ parentId: { $in: userAnswerIds } });
  await Answer.deleteMany({ answeredBy: userId });

  const answersOnUserQuestions = await Answer.find({
    question: { $in: questionsIds },
  });
  const answersOnUserQuestionIds = answersOnUserQuestions.map((a) => a._id);

  await Comment.deleteMany({ parentId: { $in: answersOnUserQuestionIds } });
  await Comment.deleteMany({ parentId: { $in: questionsIds } });
  await Answer.deleteMany({ question: { $in: questionsIds } });
  await Question.deleteMany({ askedBy: userId });

  await Comment.deleteMany({ commentedBy: userId });
  await Bookmark.deleteMany({ userId: userId });
  await Notification.deleteMany({ user: userId });

  const deletedUser = await clerkClient.users.deleteUser(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedUser: deletedUser },
        "Account deleted successfully.",
      ),
    );
});

export { getMe, deleteMe };
