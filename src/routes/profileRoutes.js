import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

// Public: view any user's profile
router.get("/:userId", getProfile);

// Private: update your own profile
router.put("/me", authMiddleware, updateProfile);

export default router;
