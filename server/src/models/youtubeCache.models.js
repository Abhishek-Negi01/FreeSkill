import mongoose from "mongoose";

const youtubeCacheSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    unique: true,
  },
  videos: [
    {
      videoId: String,
      title: String,
      thumbnail: String,
      channelTitle: String,
      duration: String,
      views: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

youtubeCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // after 24 hours, the cache will be cleared automatically (24 * 60 * 60 = 86400 seconds)

export const YoutubeCache = mongoose.model("YoutubeCache", youtubeCacheSchema);
