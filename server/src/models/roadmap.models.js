import mongoose from "mongoose";

const RoadmapStepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  order: {
    type: Number,
    required: true,
  },
});

const RoadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    creator: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    steps: [RoadmapStepSchema],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
    cloneCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

RoadmapSchema.index({ creator: 1 });
RoadmapSchema.index({ isPublic: 1, createdAt: -1 });
RoadmapSchema.index({ tags: 1 });

const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
