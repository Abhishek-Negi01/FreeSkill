import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  upvoteAnswer,
  downvoteAnswer,
} from "../controllers/answer.controllers.js";

const router = Router();

router.route("/").post(authenticateUser, createAnswer);
router.route("/question/:questionId").get(getAnswersByQuestion);
router.route("/:answerId").put(authenticateUser, updateAnswer);
router.route("/:answerId").delete(authenticateUser, deleteAnswer);
router.route("/:answerId/accept").patch(authenticateUser, acceptAnswer);
router.route("/:answerId/upvote").patch(authenticateUser, upvoteAnswer);
router.route("/:answerId/downvote").patch(authenticateUser, downvoteAnswer);

export default router;
