import Audio from "../models/Audio.js";
import { extractAudioMetadata } from "../utils/metadata.js";
import User from "../models/User.js";

// @desc    Upload audio + extract metadata
// @route   POST /api/audio/upload
// @access  Private
export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const filePath = req.file.path;
    const fileUrl = `/uploads/audio/${req.file.filename}`;

    const metadata = await extractAudioMetadata(filePath);

    const audio = await Audio.create({
      uploader: req.user._id,
      filename: req.file.filename,
      url: fileUrl,
      mimetype: req.file.mimetype,
      title: metadata.title,
      duration: metadata.duration,
      bitrate: metadata.bitrate,
    });

    return res.status(201).json(audio);
  } catch (error) {
    console.error("Audio upload error:", error.message);
    return res.status(500).json({ message: "Server error uploading audio" });
  }
};

// @desc    Set profile song
// @route   PUT /api/audio/profile-song/:audioId
// @access  Private
export const setProfileSong = async (req, res) => {
  try {
    const { audioId } = req.params;

    const audio = await Audio.findById(audioId);
    if (!audio) {
      return res.status(404).json({ message: "Audio not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileSong: audioId },
      { new: true }
    ).populate("profileSong");

    return res.json(user);
  } catch (error) {
    console.error("Set profile song error:", error.message);
    return res.status(500).json({ message: "Server error setting profile song" });
  }
};

// @desc    Get audio info
// @route   GET /api/audio/:audioId
// @access  Public
export const getAudio = async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.audioId);

    if (!audio) {
      return res.status(404).json({ message: "Audio not found" });
    }

    return res.json(audio);
  } catch (error) {
    console.error("Get audio error:", error.message);
    return res.status(500).json({ message: "Server error fetching audio" });
  }
};
