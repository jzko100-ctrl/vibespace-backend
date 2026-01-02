import * as mm from "music-metadata";
import fs from "fs";

export const getAudioMetadata = async (filePath) => {
  try {
    const stream = fs.createReadStream(filePath);
    const metadata = await mm.parseStream(stream);
    stream.close();
    return metadata;
  } catch (error) {
    console.error("Metadata error:", error);
    return null;
  }
};
