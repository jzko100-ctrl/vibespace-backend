import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  postComment,
  replyToComment,
  getCommentsForUser,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Public: fetch comments for a user
router.get("/:userId", getCommentsForUser);

// Private: post a comment
router.post("/:targetUserId", authMiddleware, postComment);

// Private: reply to a comment
router.post("/reply/:commentId", authMiddleware, replyToComment);

// Private: delete a comment
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
