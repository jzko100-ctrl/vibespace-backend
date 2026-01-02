import Activity from "../models/Activity.js";
import User from "../models/User.js";

// @desc    Get global activity feed (everyone)
// @route   GET /api/activity/global
// @access  Public
export const getGlobalFeed = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "username avatar");

    return res.json(activities);
  } catch (error) {
    console.error("Global feed error:", error.message);
    return res.status(500).json({ message: "Server error fetching global feed" });
  }
};

// @desc    Get activity feed for a specific user
// @route   GET /api/activity/user/:userId
// @access  Public
export const getUserFeed = async (req, res) => {
  try {
    const { userId } = req.params;

    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "username avatar");

    return res.json(activities);
  } catch (error) {
    console.error("User feed error:", error.message);
    return res.status(500).json({ message: "Server error fetching user feed" });
  }
};

// @desc    Get friends-only activity feed for logged-in user
// @route   GET /api/activity/friends
// @access  Private
export const getFriendsFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("friends");

    const activities = await Activity.find({
      user: { $in: user.friends },
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "username avatar");

    return res.json(activities);
  } catch (error) {
    console.error("Friends feed error:", error.message);
    return res.status(500).json({ message: "Server error fetching friends feed" });
  }
};
