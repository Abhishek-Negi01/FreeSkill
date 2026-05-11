import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      trim: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

NoteSchema.index({ userId: 1, videoId: 1 });

export const Note = mongoose.model("Note", NoteSchema);
