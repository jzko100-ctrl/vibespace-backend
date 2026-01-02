import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
} from "../controllers/blockController.js";

const router = express.Router();

router.post("/:userId", authMiddleware, blockUser);
router.post("/unblock/:userId", authMiddleware, unblockUser);
router.get("/list", authMiddleware, getBlockedUsers);

export default router;
