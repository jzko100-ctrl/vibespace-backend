import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getGlobalFeed,
  getUserFeed,
  getFriendsFeed,
} from "../controllers/activityController.js";

const router = express.Router();

// Public feeds
router.get("/global", getGlobalFeed);
router.get("/user/:userId", getUserFeed);

// Friends-only feed
router.get("/friends", authMiddleware, getFriendsFeed);

export default router;
