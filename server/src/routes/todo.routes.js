import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
  addTodo,
  deleteTodo,
  getTodosByCourse,
  toggleTodo,
  updateTodo,
} from "../controllers/todo.controllers.js";

const router = Router();

router.route("/").post(authenticateUser, addTodo);

router.route("/course/:courseId").get(authenticateUser, getTodosByCourse);

router.route("/:todoId/toggle").patch(authenticateUser, toggleTodo);

router.route("/:todoId").put(authenticateUser, updateTodo);

router.route("/:todoId").delete(authenticateUser, deleteTodo);

export default router;
