import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { searchYoutubeVideos } from "../controllers/youtube.controllers.js";

const router = Router();

router.route("/search").get(authenticateUser, searchYoutubeVideos); // search youtube videos

export default router;
