import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    coverPhoto: {
      type: String,
      default: "",
    },

    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photo",
      },
    ],
  },
  { timestamps: true }
);

const Album = mongoose.model("Album", AlbumSchema);
export default Album;
