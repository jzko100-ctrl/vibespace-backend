import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    // ⭐ Who did the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⭐ Type of activity
    type: {
      type: String,
      enum: [
        "profile_update",
        "profile_song",
        "friend_request",
        "friend_accept",
        "comment",
        "album_create",
        "photo_upload",
      ],
      required: true,
    },

    // ⭐ Human-readable message
    message: {
      type: String,
      required: true,
      maxlength: 300,
    },

    // ⭐ Optional: extra data for frontend (IDs, etc.)
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;
