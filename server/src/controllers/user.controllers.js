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

  // Get user's courses and related data
  const courses = await Course.find({ creator: userId });
  const courseIds = courses.map((c) => c._id);

  const questions = await Question.find({ askedBy: userId });
  const questionIds = questions.map((q) => q._id);

  const userAnswers = await Answer.find({ answeredBy: userId });
  const userAnswerIds = userAnswers.map((a) => a._id);

  // Clean up in proper order to maintain referential integrity

  // 1. Remove accepted answer references
  await Question.updateMany(
    { acceptedAnswer: { $in: userAnswerIds } },
    { $set: { acceptedAnswer: null } },
  );

  // 2. Delete comments on user's answers and questions
  await Comment.deleteMany({
    parentId: { $in: [...userAnswerIds, ...questionIds] },
  });

  // 3. Delete user's comments
  await Comment.deleteMany({ commentedBy: userId });

  // 4. Delete answers on user's questions
  const answersOnUserQuestions = await Answer.find({
    question: { $in: questionIds },
  });
  await Answer.deleteMany({ question: { $in: questionIds } });

  // 5. Delete user's answers and questions
  await Answer.deleteMany({ answeredBy: userId });
  await Question.deleteMany({ askedBy: userId });

  // 6. Delete course-related data
  await Video.deleteMany({ course: { $in: courseIds } });
  await Course.deleteMany({ creator: userId });

  // 7. Delete user's bookmarks and notifications
  await Bookmark.deleteMany({ userId });
  await Notification.deleteMany({ user: userId });

  // 8. Delete user from Clerk
  const deletedUser = await clerkClient.users.deleteUser(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedUser }, "Account deleted successfully."),
    );
});

export { getMe, deleteMe };
