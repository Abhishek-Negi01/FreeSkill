import mongoose from "mongoose";

const RoadmapProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    completedSteps: [
      {
        stepId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    currentStep: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Unique constraint - one progress per user per roadmap

RoadmapProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

export const RoadmapProgressSchema = mongoose.model(
  "RoadmapProgress",
  RoadmapProgressSchema,
);
