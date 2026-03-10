import { Notification } from "../models/notification.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const notifications = await Notification.find({ user: userId })
    .populate("relatedUser", "username fullname")
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        unreadCount,
      },
      "Notifications fetched successfully",
    ),
  );
});

const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { notificationId } = req.params;

  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  notification.isRead = true;
  await notification.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { notification }, "Notification marked as read"),
    );
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const notifications = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { notifications },
        "All notifications marked as read",
      ),
    );
});

const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { notificationId } = req.params;

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { notification },
        "Notification deleted successfully",
      ),
    );
});

export { getNotifications, markAsRead, markAllAsRead, deleteNotification };
