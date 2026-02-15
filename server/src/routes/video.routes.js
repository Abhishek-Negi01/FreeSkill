import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
  addVideo,
  getAllVideos,
  getVideo,
  deleteVideo,
} from "../controllers/video.controllers.js";

const router = Router();

router.route("/:courseId").post(authenticateUser, addVideo); // add video to course
router.route("/:courseId").get(authenticateUser, getAllVideos); // get all videos of course
router.route("/:videoId").patch(authenticateUser, getVideo); // get video by id
router.route("/:videoId").delete(authenticateUser, deleteVideo); // delete video by id

export default router;
