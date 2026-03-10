import { Router } from "express";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/").get(authenticateUser, getNotifications);
router.route("/mark-all-read").patch(authenticateUser, markAllAsRead);
router.route("/:notificationId/read").patch(authenticateUser, markAsRead);
router.route("/:notificationId").delete(authenticateUser, deleteNotification);

export default router;
