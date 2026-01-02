import { getAudioMetadata } from "../utils/metadata.js";
import Audio from "../models/Audio.js";
import fs from "fs";
import path from "path";

// -----------------------------------------------------
// Upload and extract metadata from audio file (PRIVATE)
// -----------------------------------------------------
export const uploadAudio = async (req, res) => {
  try {
    const filePath = path.join("attached_assets/sounds", req.file.filename);
    const metadata = await getAudioMetadata(filePath);

    const newAudio = await Audio.create({
      uploader: req.user.id,
      filename: req.file.filename,
      metadata,
    });

    res.status(201).json(newAudio);
  } catch (error) {
    res.status(500).json({
      message: "Error uploading audio",
      error: error.message,
    });
  }
};
