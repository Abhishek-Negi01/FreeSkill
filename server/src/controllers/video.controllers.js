import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.models.js";

const addVideo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

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

  try {
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
  } catch (error) {
    throw new ApiError(500, "Failed to add video");
  }
});

const getAllVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

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
  const userId = req.user?._id;

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
  const userId = req.user?._id;

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

  if (video.course?.creator?._id.toString() !== userId.toString()) {
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

export { addVideo, getAllVideos, getVideo, deleteVideo };
