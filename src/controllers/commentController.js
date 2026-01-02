import Comment from "../models/Comment.js";
import User from "../models/User.js";

// -----------------------------------------------------
// Get all comments for a specific user (PUBLIC)
// -----------------------------------------------------
export const getCommentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const comments = await Comment.find({ targetUser: userId })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments for user",
      error: error.message,
    });
  }
};

// -----------------------------------------------------
// Post a comment on a user's profile (PRIVATE)
// -----------------------------------------------------
export const postComment = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const { text } = req.body;

    const newComment = await Comment.create({
      author: req.user.id,
      targetUser: targetUserId,
      text,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({
      message: "Error posting comment",
      error: error.message,
    });
  }
};

// -----------------------------------------------------
// Reply to a comment (PRIVATE)
// -----------------------------------------------------
export const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = await Comment.create({
      author: req.user.id,
      targetUser: parentComment.targetUser,
      text,
      parentComment: commentId,
    });

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({
      message: "Error replying to comment",
      error: error.message,
    });
  }
};

// -----------------------------------------------------
// Delete a comment (PRIVATE)
// -----------------------------------------------------
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only author or target user can delete
    if (
      comment.author.toString() !== req.user.id &&
      comment.targetUser.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting comment",
      error: error.message,
    });
  }
};
