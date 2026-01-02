import User from "../models/User.js";
import Activity from "../models/Activity.js";

// @desc    Get a user's public profile
// @route   GET /api/profiles/:userId
// @access  Public
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password")
      .populate("profileSong")
      .populate("topFriends", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/profiles/me
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    // Fetch old user to compare profileSong
    const oldUser = await User.findById(req.user._id);

    const updates = {
      aboutMe: req.body.aboutMe,
      interests: req.body.interests,
      mood: req.body.mood,
      links: req.body.links,
      topFriends: req.body.topFriends,
      profileSong: req.body.profileSong,
      avatar: req.body.avatar,
      coverPhoto: req.body.coverPhoto,
    };

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    )
      .select("-password")
      .populate("profileSong")
      .populate("topFriends", "username avatar");

    // ⭐ Activity: Profile updated
    await Activity.create({
      user: user._id,
      type: "profile_update",
      message: `${user.username} updated their profile`,
    });

    // ⭐ Activity: Profile song changed
    if (
      req.body.profileSong &&
      req.body.profileSong !== String(oldUser.profileSong)
    ) {
      await Activity.create({
        user: user._id,
        type: "profile_song",
        message: `${user.username} updated their profile song`,
        metadata: { profileSong: req.body.profileSong },
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ message: "Server error updating profile" });
  }
};