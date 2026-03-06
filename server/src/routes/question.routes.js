import Router from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
  createQuestion,
  deleteQuestion,
  downvoteQuestion,
  getQuestionById,
  getQuestionsByVideo,
  updateQuestion,
  upvoteQuestion,
  getAllQuestions,
} from "../controllers/question.controllers.js";

const router = Router();

router.route("/").get(getAllQuestions); // public - all user can see

router.route("/").post(authenticateUser, createQuestion); // Protected
router.route("/video/:videoId").get(getQuestionsByVideo);
router.route("/:questionId").get(getQuestionById);
router.route("/:questionId").put(authenticateUser, updateQuestion);
router.route("/:questionId").delete(authenticateUser, deleteQuestion);
router.route("/:questionId/upvote").patch(authenticateUser, upvoteQuestion);
router.route("/:questionId/downvote").patch(authenticateUser, downvoteQuestion);

export default router;
