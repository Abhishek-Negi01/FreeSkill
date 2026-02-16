import { Router } from "express";

const router = Router();

import {
  createCourse,
  deleteCourse,
  getCourse,
  updateCourse,
  getAllCourse,
  getCourseProgress,
} from "../controllers/course.controllers.js";

import { authenticateUser } from "../middlewares/auth.middlewares.js";

// protected routes
router.route("/").post(authenticateUser, createCourse); // create course
router.route("/").get(authenticateUser, getAllCourse); // get all courses of the user
router.route("/:courseId").get(authenticateUser, getCourse); // get a specific course of the user
router.route("/:courseId").put(authenticateUser, updateCourse); // update a specific course of the user
router.route("/:courseId").delete(authenticateUser, deleteCourse); // delete a specific course of the user
router.route("/:courseId/progress").get(authenticateUser, getCourseProgress); // get course progress
export default router;
