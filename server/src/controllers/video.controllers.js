import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.models.js";
import mongoose from "mongoose";

const addVideo = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const courseId = req.params.courseId;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const { videoId, title, thumbnail, duration, channelTitle, order } = req.body;

  if (!videoId || !title) {
    throw new ApiError(400, "Video ID and title are required");
  }

  const course = await Course.findOne({
    _id: courseId,
    creator: userId,
  });

  if (!course) {
    throw new ApiError(404, "Course not found or unauthorized");
  }

  const video = await Video.create({
    videoId,
    title,
    thumbnail,
    duration,
    channelTitle,
    order,
    course: courseId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { video }, "Video added successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const courseId = req.params.courseId;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const course = await Course.findOne({
    _id: courseId,
    creator: userId,
  });

  if (!course) {
    throw new ApiError(404, "Course not found or unauthorized");
  }

  const videos = await Video.find({
    course: courseId,
  }).sort({ order: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "Videos fetched successfully"));
});

const getVideo = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const videoId = req.params.videoId;

  if (!videoId) {
    throw new ApiError(400, "video ID is required");
  }

  const video = await Video.findById(videoId).populate({
    path: "course",
    match: { creator: userId },
  });

  if (!video || !video.course) {
    throw new ApiError(404, "Video not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video fetched successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const videoId = req.params.videoId;

  if (!videoId) {
    throw new ApiError(400, "video ID is required");
  }

  const video = await Video.findById(videoId).populate("course");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.course?.creator !== userId.toString()) {
    throw new ApiError(403, "Unable to delete video.");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: deletedVideo },
        "Video deleted successfully",
      ),
    );
});

const markVideoAsCompleted = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const videoId = req.params.videoId;

  if (!videoId) {
    throw new ApiError(400, "video ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("course");

  if (!video || video.course?.creator !== userId.toString()) {
    throw new ApiError(404, "Video not found or unauthorized");
  }

  video.isCompleted = !video.isCompleted;
  await video.save();

  const status = video.isCompleted ? "completed" : "incomplete";
  return res
    .status(200)
    .json(
      new ApiResponse(200, { video }, `Video marked as ${status} successfully`),
    );
});

const reorderVideos = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { videoIds, videoOrders } = req.body;

  // Support both formats: videoIds array or videoOrders array
  if (videoIds && Array.isArray(videoIds)) {
    // Frontend sends flat array of IDs
    await Promise.all(
      videoIds.map((videoId, index) =>
        Video.findByIdAndUpdate(videoId, { order: index + 1 }),
      ),
    );
  } else if (videoOrders && Array.isArray(videoOrders)) {
    // Legacy format: array of {videoId, order}
    await Promise.all(
      videoOrders.map(({ videoId, order }) =>
        Video.findByIdAndUpdate(videoId, { order }),
      ),
    );
  } else {
    throw new ApiError(400, "videoIds or videoOrders array is required");
  }

  const videos = await Video.find({ course: courseId }).sort({ order: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "Videos reordered successfully"));
});

const getPublicVideos = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findOne({ _id: courseId, isPublic: true });

  if (!course) {
    throw new ApiError(404, "Public course not found");
  }

  const videos = await Video.find({ course: courseId }).sort({ order: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "Videos fetched successfully"));
});

export {
  addVideo,
  getAllVideos,
  getVideo,
  deleteVideo,
  markVideoAsCompleted,
  reorderVideos,
  getPublicVideos,
};
