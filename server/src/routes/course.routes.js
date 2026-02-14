import { Router } from "express";

const router = Router();

import {
  createCourse,
  deleteCourse,
  getCourse,
  updateCourse,
  getAllCourse,
} from "../controllers/course.controllers.js";

import { authenticateUser } from "../middlewares/auth.middlewares.js";

// protected routes
router.route("/createCourse").post(authenticateUser, createCourse);
router.route("/getAllCourse").get(authenticateUser, getAllCourse);
router.route("/course/:courseId").get(authenticateUser, getCourse);
router.route("/updateCourse/:courseId").put(authenticateUser, updateCourse);
router.route("/deleteCourse/:courseId").delete(authenticateUser, deleteCourse);

export default router;
