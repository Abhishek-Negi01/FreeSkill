import { Router } from "express";
import { getMe, deleteMe } from "../controllers/user.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/").get(authenticateUser, getMe);
router.route("/").delete(authenticateUser, deleteMe);

export default router;
