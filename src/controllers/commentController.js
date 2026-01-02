import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";

// @desc    Post a comment on a user's profile
// @route   POST /api/comments/:profileOwnerId
// @access  Private
export const createComment = async (req, res) => {
  try {
    const { profileOwnerId } = req.params;
    const { text } = req.body;

    const profileOwner = await User.findById(profileOwnerId);
    if (!profileOwner) {
      return res.status(404).json({ message: "Profile owner not found" });
    }

    // Create comment
    const comment = await Comment.create({
      author: req.user._id,
      profileOwner: profileOwnerId,
      text,
    });

    // ⭐ Notification: profile owner gets notified
    await Notification.create({
      user: profileOwnerId,
      sender: req.user._id,
      type: "comment",
      message: `${req.user.username} commented on your profile`,
    });

    // ⭐ Activity: comment posted
    await Activity.create({
      user: req.user._id,
      type: "comment",
      message: `${req.user.username} left a new comment`,
      metadata: { profileOwnerId },
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Create comment error:", error.message);
    return res.status(500).json({ message: "Server error posting comment" });
  }
};

// @desc    Get comments for a user's profile
// @route   GET /api/comments/:profileOwnerId
// @access  Public
export const getComments = async (req, res) => {
  try {
    const { profileOwnerId } = req.params;

    const comments = await Comment.find({ profileOwner: profileOwnerId })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error.message);
    return res.status(500).json({ message: "Server error fetching comments" });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only author or profile owner can delete
    if (
      comment.author.toString() !== req.user._id &&
      comment.profileOwner.toString() !== req.user._id
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    return res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete comment error:", error.message);
    return res.status(500).json({ message: "Server error deleting comment" });
  }
};
