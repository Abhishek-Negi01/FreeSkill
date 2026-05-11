import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/note.models.js";
import { Video } from "../models/video.models.js";

const createNote = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { title, text, videoId, courseId, timestamp } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "Note title is required");
  }

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId).populate("course");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const note = await Note.create({
    title: title.trim(),
    text: text?.trim() || "",
    videoId,
    courseId: courseId || video.course._id,
    userId,
    timestamp: timestamp || 0,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        note,
      },
      "Note created successfully",
    ),
  );
});

const getNotesByVideo = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  const { videoId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const notes = await Note.find({ userId, videoId }).sort({ timestamp: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { notes }, "Notes fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  const { noteId } = req.params;
  const { title, text, timestamp } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw new ApiError(404, "Note not found");
  }
  if (title !== undefined) {
    note.title = title.trim();
  }
  if (text !== undefined) {
    note.text = text.trim();
  }
  if (timestamp !== undefined) {
    note.timestamp = timestamp;
  }

  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { note }, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  const { noteId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const note = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedNote: note }, "Note deleted successfully"),
    );
});

export { createNote, getNotesByVideo, updateNote, deleteNote };
