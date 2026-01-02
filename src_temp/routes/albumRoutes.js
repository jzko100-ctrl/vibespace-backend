import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createAlbum,
  getUserAlbums,
  getAlbum,
  deleteAlbum,
} from "../controllers/albumController.js";

const router = express.Router();

router.post("/", authMiddleware, createAlbum);
router.get("/user/:userId", getUserAlbums);
router.get("/:albumId", getAlbum);
router.delete("/:albumId", authMiddleware, deleteAlbum);

export default router;
