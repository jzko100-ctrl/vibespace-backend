import User from "../models/User.js";
import Album from "../models/Album.js";
import Photo from "../models/Photo.js";

// Helper: build case-insensitive regex
const buildRegex = (query) => ({
  $regex: query,
  $options: "i",
});

// @desc    Global search across users, albums, photos
// @route   GET /api/search?q=term
// @access  Public
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const query = q.trim();

    // Users: username, mood, interests
    const usersPromise = User.find({
      $or: [
        { username: buildRegex(query) },
        { mood: buildRegex(query) },
        { interests: buildRegex(query) },
      ],
    })
      .select("username avatar mood interests profileSong")
      .limit(20);

    // Albums: title, description
    const albumsPromise = Album.find({
      $or: [
        { title: buildRegex(query) },
        { description: buildRegex(query) },
      ],
    })
      .populate("owner", "username avatar")
      .limit(20);

    // Photos: caption
    const photosPromise = Photo.find({
      caption: buildRegex(query),
    })
      .populate("owner", "username avatar")
      .populate("album", "title")
      .limit(20);

    const [users, albums, photos] = await Promise.all([
      usersPromise,
      albumsPromise,
      photosPromise,
    ]);

    return res.json({
      query,
      users,
      albums,
      photos,
    });
  } catch (error) {
    console.error("Global search error:", error.message);
    return res.status(500).json({ message: "Server error performing search" });
  }
};

// @desc    Search users only
// @route   GET /api/search/users?q=term
// @access  Public
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const query = q.trim();

    const users = await User.find({
      $or: [
        { username: buildRegex(query) },
        { mood: buildRegex(query) },
        { interests: buildRegex(query) },
      ],
    })
      .select("username avatar mood interests profileSong")
      .limit(50);

    return res.json(users);
  } catch (error) {
    console.error("User search error:", error.message);
    return res.status(500).json({ message: "Server error searching users" });
  }
};

// @desc    Search albums only
// @route   GET /api/search/albums?q=term
// @access  Public
export const searchAlbums = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const query = q.trim();

    const albums = await Album.find({
      $or: [
        { title: buildRegex(query) },
        { description: buildRegex(query) },
      ],
    })
      .populate("owner", "username avatar")
      .limit(50);

    return res.json(albums);
  } catch (error) {
    console.error("Album search error:", error.message);
    return res.status(500).json({ message: "Server error searching albums" });
  }
};

// @desc    Search photos only
// @route   GET /api/search/photos?q=term
// @access  Public
export const searchPhotos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const query = q.trim();

    const photos = await Photo.find({
      caption: buildRegex(query),
    })
      .populate("owner", "username avatar")
      .populate("album", "title")
      .limit(50);

    return res.json(photos);
  } catch (error) {
    console.error("Photo search error:", error.message);
    return res.status(500).json({ message: "Server error searching photos" });
  }
};
