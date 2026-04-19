import { Video } from "../models/video.models.js";
import { Course } from "../models/course.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { clerkClient } from "@clerk/express";

const createCourse = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const username = clerkUser.username || clerkUser.firstName || "Anonymous";

  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required.");
  }

  const course = await Course.create({
    title,
    description,
    creator: userId,
    creatorUsername: username,
  });

  if (!course) {
    throw new ApiError(500, "Failed to create course.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { course }, "Course created successfully."));
});

// do it later
const getCourse = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const courseId = req.params.courseId;
  if (!courseId) {
    throw new ApiError(400, "Course ID is required.");
  }
  const course = await Course.findOne({ _id: courseId, creator: userId });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { course }, "Course fetched successfully."));
});

const getAllCourse = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const courses = await Course.find({ creator: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, { courses }, "Courses fetched successfully."));
});

const updateCourse = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const courseId = req.params.courseId;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required.");
  }

  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(
      400,
      "At least one field (title or description) is required to update.",
    );
  }

  const updatedCourse = await Course.findOneAndUpdate(
    { _id: courseId, creator: userId },
    { $set: { title, description } },
    { new: true },
  );

  if (!updatedCourse) {
    throw new ApiError(404, "Course not found or unauthorized.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { course: updatedCourse },
        "Course updated successfully.",
      ),
    );
});

const deleteCourse = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const courseId = req.params.courseId;
  if (!courseId) {
    throw new ApiError(400, "Course ID is required.");
  }

  const deletedCourse = await Course.findOneAndDelete({
    _id: courseId,
    creator: userId,
  });

  if (!deletedCourse) {
    throw new ApiError(404, "Course not found or unauthorized.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { course: deletedCourse },
        "Course deleted successfully.",
      ),
    );
});

const getCourseProgress = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const courseId = req.params.courseId;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required.");
  }

  const course = await Course.findOne({
    _id: courseId,
    creator: userId,
  });

  if (!course) {
    throw new ApiError(404, "Course not found or unauthorized");
  }

  const totalVideos = await Video.countDocuments({ course: courseId });
  const completedVideos = await Video.countDocuments({
    course: courseId,
    isCompleted: true,
  });

  const progress =
    totalVideos === 0 ? 0 : (completedVideos / totalVideos) * 100;
  const formattedProgress = parseFloat(progress.toFixed(2));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { progress: formattedProgress },
        "Course progress fetched successfully.",
      ),
    );
});

const duplicateCourse = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const clerkUser = await clerkClient.users.getUser(userId);
  const username = clerkUser.username || clerkUser.firstName || "Anonymous";
  const { courseId } = req.params;

  const originalCourse = await Course.findById(courseId);
  if (!originalCourse) {
    throw new ApiError(404, "Course not found");
  }

  if (originalCourse.creator.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only duplicate your own courses");
  }

  // create duplicate course
  const duplicatedCourse = await Course.create({
    title: `${originalCourse.title} (Copy)`,
    description: originalCourse.description,
    creator: userId,
    creatorUsername: username,
  });

  const originalVideos = await Video.find({ course: courseId });

  if (originalVideos.length > 0) {
    const duplicatedVideos = originalVideos.map((video) => ({
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
      channelTitle: video.channelTitle,
      course: duplicatedCourse._id,
      order: video.order,
    }));

    await Video.insertMany(duplicatedVideos);
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { course: duplicatedCourse },
        "Course duplicated successfully",
      ),
    );
});

const getCourseStatistics = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const videos = await Video.find({ course: courseId });

  // Calculate total duration (convert ISO 8601 duration to seconds)
  const totalDuration = videos.reduce((acc, video) => {
    if (!video.duration) {
      return acc;
    }
    const match = video.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) {
      return acc;
    }
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    return acc + hours * 3600 + minutes * 60 + seconds;
  }, 0);

  const completedVideos = videos.filter((v) => v.isCompleted).length;
  const completionRate =
    videos.length > 0 ? Math.round((completedVideos / videos.length) * 100) : 0;

  const statistics = {
    totalVideos: videos.length,
    completedVideos,
    completionRate,
    totalDurationSecond: totalDuration,
    totalDurationFormatted: formatDuration(totalDuration),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, { statistics }, "Statistics fetched successfully"),
    );
});

// helper functions
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

const togglePublic = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { courseId } = req.params;
  const course = await Course.findOne({ _id: courseId, creator: userId });

  if (!course) {
    throw new ApiError(404, "Course not found or unauthorized");
  }

  course.isPublic = !course.isPublic;
  await course.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { course },
        `Course is now ${course.isPublic ? "public" : "private"}`,
      ),
    );
});

const getPublicCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findOne({
    _id: courseId,
    isPublic: true,
  });

  if (!course) {
    throw new ApiError(404, "Public course not found");
  }

  // increment view count
  course.viewCount += 1;
  await course.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { course }, "Public course fetched successfully"),
    );
});

const getAllPublicCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = { isPublic: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Course.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalCourses: count,
      },
      "Public courses fetched successfully",
    ),
  );
});

const clonePublicCourse = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const username = clerkUser.username || clerkUser.firstName || "Anonymous";

  const { courseId } = req.params;
  const originalCourse = await Course.findOne({
    _id: courseId,
    isPublic: true,
  });

  if (!originalCourse) {
    throw new ApiError(404, "Public course not found");
  }

  // create cloned course
  const clonedCourse = await Course.create({
    title: `${originalCourse.title} (Cloned)`,
    description: originalCourse.description,
    creator: userId,
    creatorUsername: username,
    isPublic: false,
  });

  // clone all videos
  const originalVideos = await Video.find({ course: courseId });

  if (originalVideos.length > 0) {
    const clonedVideos = originalVideos.map((video) => ({
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
      channelTitle: video.channelTitle,
      course: clonedCourse._id,
      order: video.order,
    }));

    await Video.insertMany(clonedVideos);
  }

  // increment cloned counter
  originalCourse.cloneCount += 1;
  await originalCourse.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { course: clonedCourse },
        "Course cloned successfully",
      ),
    );
});

export {
  createCourse,
  getAllCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCourseProgress,
  duplicateCourse,
  getCourseStatistics,
  togglePublic,
  getPublicCourse,
  getAllPublicCourses,
  clonePublicCourse,
};
