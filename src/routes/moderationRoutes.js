import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  submitReport,
  getReports,
  resolveReport,
  banUser,
  unbanUser,
} from "../controllers/moderationController.js";

const router = express.Router();

router.post("/report", authMiddleware, submitReport);
router.get("/reports", authMiddleware, getReports);
router.put("/resolve/:reportId", authMiddleware, resolveReport);
router.put("/ban/:userId", authMiddleware, banUser);
router.put("/unban/:userId", authMiddleware, unbanUser);

export default router;
