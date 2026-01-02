import mm from "music-metadata";
import fs from "fs";

export const extractAudioMetadata = async (filePath) => {
  try {
    const metadata = await mm.parseFile(filePath);

    return {
      title: metadata.common.title || "",
      duration: metadata.format.duration || 0,
      bitrate: metadata.format.bitrate || 0,
    };
  } catch (error) {
    console.error("Metadata extraction error:", error.message);
    return {
      title: "",
      duration: 0,
      bitrate: 0,
    };
  }
};
