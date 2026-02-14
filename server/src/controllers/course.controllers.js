import { User } from "../models/user.models.js";
import { Course } from "../models/course.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createCourse = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized.");
    }

    const { title, description } = req.body;

    if (!title || !description) {
      throw new ApiError(400, "Title and description are required.");
    }

    const course = await Course.create({
      title,
      description,
      creator: userId,
    });

    if (!course) {
      throw new ApiError(500, "Failed to create course.");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, { course }, "Course created successfully."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating course.");
  }
});

// do it later
const getCourse = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
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
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching course.");
  }
});

const getAllCourse = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized.");
    }

    const courses = await Course.find({ creator: userId });

    if (!courses) {
      throw new ApiError(404, "No courses found for the user.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { courses }, "Courses fetched successfully."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching all courses.");
  }
});

const updateCourse = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

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
  } catch (error) {
    throw new ApiError(500, "Something went wrong while updating course.");
  }
});

const deleteCourse = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
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
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deleting course.");
  }
});

export { createCourse, getAllCourse, getCourse, updateCourse, deleteCourse };
