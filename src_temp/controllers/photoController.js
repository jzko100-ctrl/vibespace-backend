import Photo from "../models/Photo.js";
import Album from "../models/Album.js";
import Activity from "../models/Activity.js";

// @desc    Upload a photo to an album
// @route   POST /api/photos/:albumId
// @access  Private
export const uploadPhoto = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { caption } = req.body;

    // Ensure file exists
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    // Ensure album exists
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Create photo entry
    const photo = await Photo.create({
      owner: req.user._id,
      album: albumId,
      imageUrl: `/uploads/${req.file.filename}`,
      caption,
    });

    // Add photo to album
    album.photos.push(photo._id);
    await album.save();

    // ⭐ Activity: Photo uploaded
    await Activity.create({
      user: req.user._id,
      type: "photo_upload",
      message: `${req.user.username} added a new photo`,
      metadata: { albumId, photoId: photo._id },
    });

    return res.status(201).json(photo);
  } catch (error) {
    console.error("Upload photo error:", error.message);
    return res.status(500).json({ message: "Server error uploading photo" });
  }
};

// @desc    Delete a photo
// @route   DELETE /api/photos/:photoId
// @access  Private
export const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await Photo.findOne({
      _id: photoId,
      owner: req.user._id,
    });

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Remove from album
    await Album.updateOne(
      { _id: photo.album },
      { $pull: { photos: photoId } }
    );

    // Delete photo
    await photo.deleteOne();

    return res.json({ message: "Photo deleted" });
  } catch (error) {
    console.error("Delete photo error:", error.message);
    return res.status(500).json({ message: "Server error deleting photo" });
  }
};
