import { Notification } from "../models/notification.models.js";

export const createNotification = async ({
  user,
  type,
  message,
  link,
  relatedUser,
}) => {
  try {
    await Notification.create({
      user,
      type,
      message,
      link,
      relatedUser,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
