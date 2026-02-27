// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.json(req.user);
  } catch (error) {
    console.error("Get me error:", error.message);
    return res.status(500).json({ message: "Server error fetching user" });
  }
};

// @desc    Check if logged-in user has premium
// @route   GET /api/users/premium
// @access  Private
export const checkPremium = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.json({ isPremium: req.user.isPremium });
  } catch (error) {
    console.error("Check premium error:", error.message);
    return res.status(500).json({ message: "Server error checking premium status" });
  }
};
