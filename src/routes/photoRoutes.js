import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadPhoto,
  deletePhoto,
} from "../controllers/photoController.js";

const router = express.Router();

router.post("/:albumId", authMiddleware, upload.single("photo"), uploadPhoto);
router.delete("/:photoId", authMiddleware, deletePhoto);

export default router;
