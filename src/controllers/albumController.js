import Album from "../models/Album.js";
import Photo from "../models/Photo.js";
import Activity from "../models/Activity.js";

// @desc    Create a new album
// @route   POST /api/albums
// @access  Private
export const createAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;

    const album = await Album.create({
      owner: req.user._id,
      title,
      description,
    });

    // ⭐ Activity: Album created
    await Activity.create({
      user: req.user._id,
      type: "album_create",
      message: `${req.user.username} created a new album: "${album.title}"`,
      metadata: { albumId: album._id },
    });

    return res.status(201).json(album);
  } catch (error) {
    console.error("Create album error:", error.message);
    return res.status(500).json({ message: "Server error creating album" });
  }
};

// @desc    Get all albums for a user
// @route   GET /api/albums/user/:userId
// @access  Public
export const getUserAlbums = async (req, res) => {
  try {
    const { userId } = req.params;

    const albums = await Album.find({ owner: userId })
      .populate("photos")
      .sort({ createdAt: -1 });

    return res.json(albums);
  } catch (error) {
    console.error("Get albums error:", error.message);
    return res.status(500).json({ message: "Server error fetching albums" });
  }
};

// @desc    Get a single album
// @route   GET /api/albums/:albumId
// @access  Public
export const getAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId).populate("photos");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    return res.json(album);
  } catch (error) {
    console.error("Get album error:", error.message);
    return res.status(500).json({ message: "Server error fetching album" });
  }
};

// @desc    Delete an album (and its photos)
// @route   DELETE /api/albums/:albumId
// @access  Private
export const deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findOne({
      _id: albumId,
      owner: req.user._id,
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Delete all photos in the album
    await Photo.deleteMany({ album: albumId });

    // Delete the album
    await album.deleteOne();

    return res.json({ message: "Album deleted" });
  } catch (error) {
    console.error("Delete album error:", error.message);
    return res.status(500).json({ message: "Server error deleting album" });
  }
};
