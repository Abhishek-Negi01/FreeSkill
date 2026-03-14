import { Router } from "express";

const router = Router();

import {
  createCourse,
  deleteCourse,
  getCourse,
  updateCourse,
  getAllCourse,
  getCourseProgress,
  duplicateCourse,
  getCourseStatistics,
  clonePublicCourse,
  getAllPublicCourses,
  getPublicCourse,
  togglePublic,
} from "../controllers/course.controllers.js";

import { authenticateUser } from "../middlewares/auth.middlewares.js";

// public routes
router.route("/public").get(getAllPublicCourses);
router.route("/public/:courseId").get(getPublicCourse);

// protected routes
router.route("/").post(authenticateUser, createCourse); // create course
router.route("/").get(authenticateUser, getAllCourse); // get all courses of the user
router.route("/:courseId").get(authenticateUser, getCourse); // get a specific course of the user
router.route("/:courseId").put(authenticateUser, updateCourse); // update a specific course of the user
router.route("/:courseId").delete(authenticateUser, deleteCourse); // delete a specific course of the user
router.route("/:courseId/progress").get(authenticateUser, getCourseProgress); // get course progress
router.route("/:courseId/duplicate").post(authenticateUser, duplicateCourse);
router
  .route("/:courseId/statistics")
  .get(authenticateUser, getCourseStatistics);
router.route("/:courseId/toggle-public").patch(authenticateUser, togglePublic);
router.route("/:courseId/clone").post(authenticateUser, clonePublicCourse);

export default router;
