import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answeredBy: {
      type: String,
      required: true,
    },
    answeredByUsername: { type: String },
    upvotes: [
      {
        type: String,
      },
    ],
    downvotes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Answer = mongoose.model("Answer", AnswerSchema);
