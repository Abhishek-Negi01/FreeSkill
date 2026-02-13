import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
    },

    duration: {
      type: String,
    },

    channelTitle: {
      type: String,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
    },
  },
  { timestamps: true },
);

// Prevent duplicate video in same course
VideoSchema.index({ videoId: 1, course: 1 }, { unique: true });

export const Video = mongoose.model("Video", VideoSchema);
