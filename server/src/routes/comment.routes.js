import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

import {
  createComment,
  deleteComment,
  getCommentsByParent,
  updateComment,
} from "../controllers/comment.controllers.js";

const router = Router();

router.route("/").post(authenticateUser, createComment);
router.route("/:parentType/:parentId").get(getCommentsByParent);
router.route("/:commentId").put(authenticateUser, updateComment);
router.route("/:commentId").delete(authenticateUser, deleteComment);

export default router;
