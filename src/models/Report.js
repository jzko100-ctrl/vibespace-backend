import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    targetComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    targetMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    targetAudio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audio",
      default: null,
    },

    reason: {
      type: String,
      required: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);
export default Report;
