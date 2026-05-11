import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middlewares.js";

import {
  createNote,
  deleteNote,
  getNotesByVideo,
  updateNote,
} from "../controllers/note.controllers.js";

const router = Router();

router.route("/").post(authenticateUser, createNote);

router.route("/video/:videoId").get(authenticateUser, getNotesByVideo);

router.route("/:noteId").put(authenticateUser, updateNote);

router.route("/:noteId").delete(authenticateUser, deleteNote);

export default router;
