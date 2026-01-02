import Notification from "../models/Notification.js";

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("sender", "username avatar");

    return res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error.message);
    return res.status(500).json({ message: "Server error fetching notifications" });
  }
};

// @desc    Get unread notifications
// @route   GET /api/notifications/unread
// @access  Private
export const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username avatar");

    return res.json(notifications);
  } catch (error) {
    console.error("Unread notifications error:", error.message);
    return res.status(500).json({ message: "Server error fetching unread notifications" });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark read error:", error.message);
    return res.status(500).json({ message: "Server error marking notifications read" });
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear
// @access  Private
export const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    return res.json({ message: "Notifications cleared" });
  } catch (error) {
    console.error("Clear notifications error:", error.message);
    return res.status(500).json({ message: "Server error clearing notifications" });
  }
};
