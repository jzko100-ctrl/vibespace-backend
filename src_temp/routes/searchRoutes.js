import express from "express";
import {
  globalSearch,
  searchUsers,
  searchAlbums,
  searchPhotos,
} from "../controllers/searchController.js";

const router = express.Router();

router.get("/", globalSearch);
router.get("/users", searchUsers);
router.get("/albums", searchAlbums);
router.get("/photos", searchPhotos);

export default router;
