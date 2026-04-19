import { Answer } from "../models/answer.models.js";
import { Comment } from "../models/comment.models.js";
import { Question } from "../models/question.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../utils/createNotification.js";
import { clerkClient } from "@clerk/express";

const createComment = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const username = clerkUser.username || clerkUser.firstName || "Anonymous";

  const { text, parentType, parentId } = req.body;

  if (!text || !parentType || !parentId) {
    throw new ApiError(400, "Text, parentType, and parentId are required");
  }

  let parentOwnerId;
  let questionId;

  // verify parent exist
  if (parentType === "Question") {
    const question = await Question.findById(parentId);
    if (!question) {
      throw new ApiError(404, "Question not found");
    }
    parentOwnerId = question.askedBy;
    questionId = parentId;
  } else if (parentType === "Answer") {
    const answer = await Answer.findById(parentId).populate("question");
    if (!answer) {
      throw new ApiError(404, "Answer not found");
    }
    parentOwnerId = answer.answeredBy;
    questionId = answer.question._id;
  }

  const comment = await Comment.create({
    text,
    commentedBy: userId,
    commentedByUsername: username,
    parentType,
    parentId,
  });

  const populatedComment = await Comment.findById(comment._id);

  // create notification for parent owner
  if (parentOwnerId.toString() !== userId.toString()) {
    await createNotification({
      user: parentOwnerId,
      type: "comment",
      message: `Someone commented on your ${parentType.toLowerCase()}`,
      link: `/questions/${questionId}`,
      relatedUser: userId,
    });
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { comment: populatedComment },
        "Comment created successfully",
      ),
    );
});

const getCommentsByParent = asyncHandler(async (req, res) => {
  const { parentType, parentId } = req.params;

  if (!parentType || !parentId) {
    throw new ApiError(400, "ParentType and parentId are required");
  }

  const comments = await Comment.find({ parentType, parentId }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { comments }, "Comments fetched successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { commentId } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.commentedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only edit your own comments");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { text },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comment: updatedComment },
        "Comment updated successfully",
      ),
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.commentedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedComment: deletedComment },
        "Comment deleted successfully",
      ),
    );
});

export { createComment, getCommentsByParent, updateComment, deleteComment };
