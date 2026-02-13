import { Router } from "express";
import {
  refreshAccessToken,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  deleteUser,
  updateUser,
  getAllUsers,
} from "../controllers/user.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const router = Router();

// public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// protected routes
router.route("/me").get(authenticateUser, getCurrentUser);
router.route("/getAllUser").get(authenticateUser, getAllUsers);
router.route("/updateUser").put(authenticateUser, updateUser);
router.route("/deleteUser").delete(authenticateUser, deleteUser);
router.route("/logout").post(authenticateUser, logoutUser);

export default router;
