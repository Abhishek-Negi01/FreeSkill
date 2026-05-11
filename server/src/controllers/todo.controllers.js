import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.models.js";
import { Course } from "../models/course.models.js";

const addTodo = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;

  const { courseId, text } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!text?.trim()) {
    throw new ApiError(400, "Todo text is required");
  }

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const course = await Course.findOne({ _id: courseId, creator: userId });

  if (!course) {
    throw new ApiError(404, "Course not found or access denied");
  }

  const todo = await Todo.create({
    userId,
    courseId,
    text: text.trim(),
    isCompleted: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { todo }, "Todo created successfully"));
});

const getTodosByCourse = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  const { courseId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const course = await Course.findOne({ _id: courseId, creator: userId });

  if (!course) {
    throw new ApiError(404, "Course not found or access denied");
  }

  const todos = await Todo.find({ userId, courseId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { todos }, "Todos fetched successfully"));
});

const toggleTodo = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  const { todoId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const todo = await Todo.findOne({ _id: todoId, userId });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.isCompleted = !todo.isCompleted;

  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { todo }, "Todo status updated successfully"));
});

const updateTodo = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  const { todoId } = req.params;
  const { text } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!text?.trim()) {
    throw new ApiError(400, "Todo text is required");
  }

  const todo = await Todo.findOne({ _id: todoId, userId });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.text = text.trim();
  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { todo }, "Todo updated successfully"));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  const { todoId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const todo = await Todo.findOneAndDelete({ _id: todoId, userId });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedTodo: todo }, "Todo deleted successfully"),
    );
});

export { addTodo, getTodosByCourse, toggleTodo, updateTodo, deleteTodo };
