import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../../api/services/notifications";
import toast from "react-hot-toast";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getAll();
      const data = response.data.data;
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch notifications";
      setError(errorMsg);
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark single notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);

      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to mark as read";
      toast.error(errorMsg);
      console.error("Failed to mark as read:", err);
      return { success: false, error: errorMsg };
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      setUnreadCount(0);

      toast.success("All notifications marked as read");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to mark all as read";
      toast.error(errorMsg);
      console.error("Failed to mark all as read:", err);
      return { success: false, error: errorMsg };
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);

      // Update local state optimistically
      const deletedNotif = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId),
      );

      // Update unread count if deleted notification was unread
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      toast.success("Notification deleted");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete notification";
      toast.error(errorMsg);
      console.error("Failed to delete notification:", err);
      return { success: false, error: errorMsg };
    }
  };

  // Format time helper
  const formatTime = useCallback((dateString) => {
    const notifDate = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - notifDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return notifDate.toLocaleDateString();
    }
  }, []);

  // Get relative time (more detailed)
  const getRelativeTime = useCallback(
    (dateString) => {
      return formatTime(dateString);
    },
    [formatTime],
  );

  // Handle notification click (mark as read if unread)
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    // Data
    notifications,
    unreadCount,
    loading,
    error,

    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationClick,

    // Utils
    fetchNotifications,
    formatTime,
    getRelativeTime,
    refetch: fetchNotifications,

    // Computed
    notificationCount: notifications.length,
    hasNotifications: notifications.length > 0,
    hasUnread: unreadCount > 0,
    isEmpty: notifications.length === 0,
    readNotifications: notifications.filter((n) => n.isRead),
    unreadNotifications: notifications.filter((n) => !n.isRead),
  };
};

export default useNotifications;
