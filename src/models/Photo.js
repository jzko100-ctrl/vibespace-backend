import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
      maxlength: 300,
    },
  },
  { timestamps: true }
);

const Photo = mongoose.model("Photo", PhotoSchema);
export default Photo;
