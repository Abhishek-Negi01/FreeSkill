import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Answer } from "../models/answer.models.js";
import { Question } from "../models/question.models.js";
import { createNotification } from "../utils/createNotification.js";
import { clerkClient } from "@clerk/express";

const createAnswer = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  const username = clerkUser.username || clerkUser.firstName || "Anonymous";

  const { questionId, body } = req.body;

  if (!questionId || !body || body.trim() === "") {
    throw new ApiError(400, "question id and answer body are required");
  }

  // verify question exist
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "question not found");
  }

  const answer = await Answer.create({
    question: questionId,
    answeredBy: userId,
    answeredByUsername: username,
    body,
  });

  const populatedAnswer = await Answer.findById(answer._id).populate(
    "question",
    "title",
  );

  // create notification for question owner
  if (question.askedBy.toString() !== userId.toString()) {
    await createNotification({
      user: question.askedBy,
      type: "answer",
      message: `Someone answered your question`,
      link: `/questions/${questionId}`,
      relatedUser: userId,
    });
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        answer: populatedAnswer,
      },
      "answer created successfully",
    ),
  );
});

const getAnswersByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  if (!questionId) {
    throw new ApiError(400, "Question ID is required");
  }

  const answers = await Answer.find({ question: questionId })

    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { answers }, "Answers fetched successfully"));
});

const updateAnswer = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { answerId } = req.params;

  if (!answerId) {
    throw new ApiError(401, "answer id is required");
  }

  const { body } = req.body;

  if (!body || body.trim() === "") {
    throw new ApiError(400, "Answer body is required");
  }

  const answer = await Answer.findById(answerId);

  if (!answer) {
    throw new ApiError(404, "Answer not found");
  }

  // only owner can edit the answer
  if (answer.answeredBy.toString() !== userId.toString()) {
    throw new ApiError(403, "user can only edit his or her answer");
  }

  const updatedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    { $set: { body } },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { answer: updatedAnswer },
        "Answer updated successfully",
      ),
    );
});

const deleteAnswer = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { answerId } = req.params;

  if (!answerId) {
    throw new ApiError(401, "answer id is required");
  }

  const answer = await Answer.findById(answerId);

  if (!answer) {
    throw new ApiError(404, "Answer not found");
  }

  // only owner can delete answer

  if (answer.answeredBy.toString() !== userId.toString()) {
    throw new ApiError(403, "user can only delete his or her own answers");
  }

  const deletedAnswer = await Answer.findByIdAndDelete(answerId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedAnswer }, "Answer deleted successfully"),
    );
});

const acceptAnswer = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { answerId } = req.params;

  if (!answerId) {
    throw new ApiError(401, "answer id is required");
  }

  const answer = await Answer.findById(answerId).populate("question");

  if (!answer) {
    throw new ApiError(404, "Answer not found");
  }

  const question = answer.question;

  // only question owner can accept answer
  if (question.askedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Only question owner can accept an answer");
  }

  question.acceptedAnswer = answerId;
  await question.save();

  const updatedQuestion = await Question.findById(question._id);

  // notify answer owner
  if (answer.answeredBy.toString() !== userId.toString()) {
    await createNotification({
      user: answer.answeredBy,
      type: "accepted",
      message: `Your answer was accepted`,
      link: `/questions/${question._id}`,
      relatedUser: userId,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { question: updatedQuestion },
        "Answer accepted successfully",
      ),
    );
});

const upvoteAnswer = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { answerId } = req.params;
  if (!answerId) {
    throw new ApiError(401, "answer id is required");
  }

  const answer = await Answer.findById(answerId);

  if (!answer) {
    throw new ApiError(404, "Answer not found");
  }

  const hasUpvoted = answer.upvotes.includes(userId);
  const hasDownvoted = answer.downvotes.includes(userId);

  if (hasUpvoted) {
    // remove from upvotes
    answer.upvotes = answer.upvotes.filter(
      (id) => id.toString() !== userId.toString(),
    );
  } else {
    // add in upvotes
    answer.upvotes.push(userId);
    // remove from downvotes
    if (hasDownvoted) {
      answer.downvotes = answer.downvotes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
  }

  await answer.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { answer }, "Vote updated successfully"));
});

const downvoteAnswer = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { answerId } = req.params;
  if (!answerId) {
    throw new ApiError(401, "answer id is required");
  }

  const answer = await Answer.findById(answerId);

  if (!answer) {
    throw new ApiError(404, "Answer not found");
  }

  const hasUpvoted = answer.upvotes.includes(userId);
  const hasDownvoted = answer.downvotes.includes(userId);

  if (hasDownvoted) {
    // remove from downvotes
    answer.downvotes = answer.downvotes.filter(
      (id) => id.toString() !== userId.toString(),
    );
  } else {
    // push in downvotes
    answer.downvotes.push(userId);

    // if it is present in upvotes then remove from there
    if (hasUpvoted) {
      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
  }

  await answer.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { answer }, "Vote updated successfully"));
});

export {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  upvoteAnswer,
  downvoteAnswer,
};
