import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

BookmarkSchema.index({ userId: 1, questionId: 1 }, { unique: true });

export const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
