import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadAudio,
  setProfileSong,
  getAudio,
} from "../controllers/audioController.js";

const router = express.Router();

// Upload audio
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadAudio
);

// Set profile song
router.put(
  "/profile-song/:audioId",
  authMiddleware,
  setProfileSong
);

// Get audio info
router.get("/:audioId", getAudio);

export default router;