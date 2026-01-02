import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  setTop8,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendFriendRequest);
router.post("/accept/:userId", authMiddleware, acceptFriendRequest);
router.post("/reject/:userId", authMiddleware, rejectFriendRequest);
router.delete("/remove/:userId", authMiddleware, removeFriend);
router.put("/top8", authMiddleware, setTop8);

export default router;
