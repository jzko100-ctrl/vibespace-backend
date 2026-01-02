import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";

// @desc    Send a friend request
// @route   POST /api/friends/request/:targetId
// @access  Private
export const sendFriendRequest = async (req, res) => {
  try {
    const { targetId } = req.params;

    const sender = await User.findById(req.user._id);
    const target = await User.findById(targetId);

    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already friends?
    if (sender.friends.includes(targetId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Already sent?
    if (sender.sentRequests.includes(targetId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Already received?
    if (sender.friendRequests.includes(targetId)) {
      return res.status(400).json({ message: "User already sent you a request" });
    }

    // Add request
    sender.sentRequests.push(targetId);
    target.friendRequests.push(sender._id);

    await sender.save();
    await target.save();

    // ⭐ Notification
    await Notification.create({
      user: targetId,
      sender: req.user._id,
      type: "friend_request",
      message: `${sender.username} sent you a friend request`,
    });

    // ⭐ Activity
    await Activity.create({
      user: req.user._id,
      type: "friend_request",
      message: `${sender.username} sent a friend request to ${target.username}`,
      metadata: { targetUserId: target._id },
    });

    return res.json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Send friend request error:", error.message);
    return res.status(500).json({ message: "Server error sending friend request" });
  }
};

// @desc    Accept a friend request
// @route   POST /api/friends/accept/:requesterId
// @access  Private
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.params;

    const user = await User.findById(req.user._id);
    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure request exists
    if (!user.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No friend request from this user" });
    }

    // Add each other as friends
    user.friends.push(requesterId);
    requester.friends.push(req.user._id);

    // Remove pending requests
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== req.user._id);

    await user.save();
    await requester.save();

    // ⭐ Notification
    await Notification.create({
      user: requesterId,
      sender: req.user._id,
      type: "friend_accept",
      message: `${user.username} accepted your friend request`,
    });

    // ⭐ Activity
    await Activity.create({
      user: req.user._id,
      type: "friend_accept",
      message: `${user.username} became friends with ${requester.username}`,
      metadata: { friendId: requester._id },
    });

    return res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Accept friend request error:", error.message);
    return res.status(500).json({ message: "Server error accepting friend request" });
  }
};

// @desc    Remove a friend
// @route   DELETE /api/friends/remove/:friendId
// @access  Private
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;

    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove each other
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== req.user._id);

    await user.save();
    await friend.save();

    return res.json({ message: "Friend removed" });
  } catch (error) {
    console.error("Remove friend error:", error.message);
    return res.status(500).json({ message: "Server error removing friend" });
  }
};