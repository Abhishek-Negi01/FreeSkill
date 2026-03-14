import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
  searchYoutubeVideos,
  importVideoByUrl,
  smartSearch,
  importPlaylist,
} from "../controllers/youtube.controllers.js";

const router = Router();

router.route("/search").get(authenticateUser, searchYoutubeVideos); // search youtube videos
router.route("/smart-search").get(authenticateUser, smartSearch);
router.route("/import-video").post(authenticateUser, importVideoByUrl);
router.route("/import-playlist").post(authenticateUser, importPlaylist);

export default router;
