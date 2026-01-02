import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";

// @desc    Send a message to another user
// @route   POST /api/messages/:receiverId
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { text } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
    });

    // ⭐ Notification: receiver gets notified
    await Notification.create({
      user: receiverId,
      sender: req.user._id,
      type: "message",
      message: `${req.user.username} sent you a message`,
    });

    // ⭐ Activity: message sent (private but still activity)
    await Activity.create({
      user: req.user._id,
      type: "message",
      message: `${req.user.username} sent a message`,
      metadata: { receiverId },
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error.message);
    return res.status(500).json({ message: "Server error sending message" });
  }
};

// @desc    Get conversation between logged-in user and another user
// @route   GET /api/messages/conversation/:otherUserId
// @access  Private
export const getConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    })
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error("Get conversation error:", error.message);
    return res.status(500).json({ message: "Server error fetching conversation" });
  }
};

// @desc    Get all conversations for logged-in user
// @route   GET /api/messages
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar")
      .sort({ createdAt: -1 });

    return res.json(messages);
  } catch (error) {
    console.error("Get conversations error:", error.message);
    return res.status(500).json({ message: "Server error fetching conversations" });
  }
};

// @desc    Mark messages from a specific user as read
// @route   PUT /api/messages/read/:otherUserId
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: req.user._id,
        read: false,
      },
      { $set: { read: true } }
    );

    return res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error.message);
    return res.status(500).json({ message: "Server error marking messages as read" });
  }
};
