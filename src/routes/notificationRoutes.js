import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotifications,
  getUnreadNotifications,
  markAllRead,
  clearNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.get("/unread", authMiddleware, getUnreadNotifications);
router.put("/read", authMiddleware, markAllRead);
router.delete("/clear", authMiddleware, clearNotifications);

export default router;
