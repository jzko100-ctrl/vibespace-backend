import mongoose from "mongoose";

const AudioSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 0, // seconds
    },

    bitrate: {
      type: Number,
      default: 0,
    },

    mimetype: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Audio = mongoose.model("Audio", AudioSchema);
export default Audio;
