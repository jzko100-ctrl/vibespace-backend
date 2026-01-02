export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.mimetype.startsWith("image/") ? "images" : "audio"}/${req.file.filename}`;

    return res.json({
      filename: req.file.filename,
      url: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ message: "Server error uploading file" });
  }
};
