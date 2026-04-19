import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    creator: {
      type: String,
      required: true,
    },
    creatorUsername: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    cloneCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

CourseSchema.index({ title: 1, creator: 1 }, { unique: true });
CourseSchema.index({ isPublic: 1, createdAt: -1 }); // for public course queries

export const Course = mongoose.model("Course", CourseSchema);
