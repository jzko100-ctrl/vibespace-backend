import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getConversation,
  markAsRead,
  getConversationList,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send/:receiverId", authMiddleware, sendMessage);
router.get("/conversation/:userId", authMiddleware, getConversation);
router.put("/read/:userId", authMiddleware, markAsRead);
router.get("/list", authMiddleware, getConversationList);

export default router;
