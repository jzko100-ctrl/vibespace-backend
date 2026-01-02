import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = express.Router();

// Upload image or audio
router.post("/", authMiddleware, upload.single("file"), uploadFile);

export default router;
