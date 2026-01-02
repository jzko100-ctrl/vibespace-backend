import Audio from "../models/Audio.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { getAudioMetadata } from "../utils/metadata.js";

// -----------------------------------------------------
// Upload audio + extract metadata
// -----------------------------------------------------
export const uploadAudio = async (req, res) => {
  try {
    const filePath = path.join("attached_assets/sounds", req.file.filename);

    const metadata = await getAudioMetadata(filePath);

    const audio = await Audio.create({
      uploader: req.user.id,
      filename: req.file.filename,
      metadata,
    });

    res.status(201).json(audio);
  } catch (error) {
    res.status(500).json({
      message: "Error uploading audio",
      error: error.message,
    });
  }
};

// -----------------------------------------------------
// Set profile song
// -----------------------------------------------------
export const setProfileSong = async (req, res) => {
  try {
    const { audioId } = req.params;

    const audio = await Audio.findById(audioId);
    if (!audio) {
      return res.status(404).json({ message: "Audio not found" });
    }

    await User.findByIdAndUpdate(req.user.id, {
      profileSong: audioId,
    });

    res.status(200).json({ message: "Profile song updated" });
  } catch (error) {
    res.status(500).json({
      message: "Error setting profile song",
      error: error.message,
    });
  }
};

// -----------------------------------------------------
// Get audio info
// -----------------------------------------------------
export const getAudio = async (req, res) => {
  try {
    const { audioId } = req.params;

    const audio = await Audio.findById(audioId);
    if (!audio) {
      return res.status(404).json({ message: "Audio not found" });
    }

    res.status(200).json(audio);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching audio",
      error: error.message,
    });
  }
};
