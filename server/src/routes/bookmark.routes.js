import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

import {
  getBookmarkedQuestions,
  toggleBookmark,
} from "../controllers/bookmark.controllers.js";

const router = Router();

router.route("/").get(authenticateUser, getBookmarkedQuestions);
router.route("/:questionId").patch(authenticateUser, toggleBookmark);

export default router;
