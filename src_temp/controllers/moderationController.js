import Report from "../models/Report.js";
import User from "../models/User.js";

// @desc    Submit a report
// @route   POST /api/moderation/report
// @access  Private
export const submitReport = async (req, res) => {
  try {
    const report = await Report.create({
      reporter: req.user._id,
      ...req.body,
    });

    await Notification.create({
  user: report.reporter,
  type: "moderation",
  message: "Your report has been reviewed",
});


    return res.status(201).json(report);
  } catch (error) {
    console.error("Report error:", error.message);
    return res.status(500).json({ message: "Server error submitting report" });
  }
};

// @desc    Get all reports (admin only)
// @route   GET /api/moderation/reports
// @access  Admin
export const getReports = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate("reporter", "username")
      .populate("targetUser", "username")
      .populate("targetComment")
      .populate("targetMessage")
      .populate("targetAudio");

    return res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error.message);
    return res.status(500).json({ message: "Server error fetching reports" });
  }
};

// @desc    Resolve a report
// @route   PUT /api/moderation/resolve/:reportId
// @access  Admin
export const resolveReport = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      { status: "resolved" },
      { new: true }
    );

    return res.json(report);
  } catch (error) {
    console.error("Resolve error:", error.message);
    return res.status(500).json({ message: "Server error resolving report" });
  }
};

// @desc    Ban a user
// @route   PUT /api/moderation/ban/:userId
// @access  Admin
export const banUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned: true },
      { new: true }
    );

    await Notification.create({
  user: req.params.userId,
  type: "moderation",
  message: "Your account has been reviewed by moderation staff",
});


    return res.json({ message: "User banned", user });
  } catch (error) {
    console.error("Ban error:", error.message);
    return res.status(500).json({ message: "Server error banning user" });
  }
};

// @desc    Unban a user
// @route   PUT /api/moderation/unban/:userId
// @access  Admin
export const unbanUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned: false },
      { new: true }
    );

    return res.json({ message: "User unbanned", user });
  } catch (error) {
    console.error("Unban error:", error.message);
    return res.status(500).json({ message: "Server error unbanning user" });
  }
};
