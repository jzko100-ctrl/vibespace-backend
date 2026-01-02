import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import audioRoutes from "./src/routes/audioRoutes.js";
import friendRoutes from "./src/routes/friendRoutes.js";
import blockRoutes from "./src/routes/blockRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import moderationRoutes from "./src/routes/moderationRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import albumRoutes from "./src/routes/albumRoutes.js";
import photoRoutes from "./src/routes/photoRoutes.js";
import activityRoutes from "./src/routes/activityRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";






dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/audio", audioRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/friends", friendRoutes);
app.use("/api/block", blockRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/moderation", moderationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/search", searchRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ message: "VibeSpace backend is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`VibeSpace backend running on port ${PORT}`);
});