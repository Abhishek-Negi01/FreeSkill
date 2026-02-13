import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentType: {
      type: String,
      enum: ["Question", "Answer"],
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Comment = mongoose.model("Comment", CommentSchema);
