import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: "",
    },

    coverPhoto: {
      type: String,
      default: "",
    },

    // ⭐ MySpace-style profile fields
    aboutMe: {
      type: String,
      default: "",
    },

    interests: {
      type: String,
      default: "",
    },

    mood: {
      type: String,
      default: "",
    },

    // ⭐ Profile song (audio file reference)
    profileSong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audio",
      default: null,
    },

    // ⭐ Moderation & Admin Flags
isAdmin: {
  type: Boolean,
  default: false,
},

isBanned: {
  type: Boolean,
  default: false,
},

    // ⭐ Friends system
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    sentRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ⭐ Blocking system
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ⭐ Top 8 friends (classic MySpace feature)
    topFriends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ⭐ Optional: social links
    links: {
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;