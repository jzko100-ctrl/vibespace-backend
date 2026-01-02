import User from "../models/User.js";

// @desc    Block a user
// @route   POST /api/block/:targetId
// @access  Private
export const blockUser = async (req, res) => {
  try {
    const { targetId } = req.params;

    const user = await User.findById(req.user._id);
    const target = await User.findById(targetId);

    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already blocked?
    if (user.blockedUsers.includes(targetId)) {
      return res.status(400).json({ message: "User already blocked" });
    }

    // Add to blocked list
    user.blockedUsers.push(targetId);

    // Remove from friends
    user.friends = user.friends.filter(id => id.toString() !== targetId);
    target.friends = target.friends.filter(id => id.toString() !== req.user._id);

    // Remove pending friend requests
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== targetId);
    user.sentRequests = user.sentRequests.filter(id => id.toString() !== targetId);

    target.friendRequests = target.friendRequests.filter(id => id.toString() !== req.user._id);
    target.sentRequests = target.sentRequests.filter(id => id.toString() !== req.user._id);

    await user.save();
    await target.save();

    return res.json({ message: "User blocked" });
  } catch (error) {
    console.error("Block user error:", error.message);
    return res.status(500).json({ message: "Server error blocking user" });
  }
};

// @desc    Unblock a user
// @route   DELETE /api/block/:targetId
// @access  Private
export const unblockUser = async (req, res) => {
  try {
    const { targetId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user.blockedUsers.includes(targetId)) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    // Remove from blocked list
    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== targetId);

    await user.save();

    return res.json({ message: "User unblocked" });
  } catch (error) {
    console.error("Unblock user error:", error.message);
    return res.status(500).json({ message: "Server error unblocking user" });
  }
};

