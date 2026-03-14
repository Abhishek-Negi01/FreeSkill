import React, { useEffect, useState } from "react";
import { notificationService } from "../api/services/notifications";
import { Link } from "react-router-dom";
import { IoNotifications, IoCheckmarkDone, IoTrash } from "react-icons/io5";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAll();
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const formatTime = (date) => {
    const notifDate = new Date(date);
    return notifDate.toLocaleDateString();
  };

  return (
    <div
      className="p-4 md:p-6"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold gradient-text mb-2"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <IoNotifications
                className="inline-block mr-3"
                style={{ color: "#2563eb" }}
              />
              Notifications
            </h1>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn btn-primary text-sm whitespace-nowrap"
            >
              <IoCheckmarkDone className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="card p-12 text-center animate-fadeIn">
            <IoNotifications
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "#d1d5db" }}
            />
            <h3 className="text-xl font-bold mb-2" style={{ color: "#374151" }}>
              No notifications yet
            </h3>
            <p style={{ color: "#6b7280" }}>
              You'll see notifications here when you get them
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-fadeIn">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`card p-4 flex flex-col sm:flex-row justify-between gap-3 ${!notif.isRead ? "border-l-4" : ""}`}
                style={{
                  borderColor: !notif.isRead ? "#3b82f6" : "transparent",
                  background: !notif.isRead ? "#eff6ff" : "white",
                }}
              >
                <Link
                  to={notif.link}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {!notif.isRead && (
                      <span
                        className="w-2 h-2 rounded-full mt-2 shrink-0"
                        style={{ background: "#3b82f6" }}
                      ></span>
                    )}
                    <p className="text-sm" style={{ color: "#1f2937" }}>
                      {notif.message}
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    {formatTime(notif.createdAt)}
                  </p>
                </Link>

                <div className="flex gap-2 sm:flex-col sm:items-end">
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="text-xs hover:text-blue-700 transition flex items-center gap-1"
                      style={{ color: "#3b82f6" }}
                    >
                      <IoCheckmarkDone className="w-4 h-4" />
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="text-xs hover:text-red-700 transition flex items-center gap-1"
                    style={{ color: "#ef4444" }}
                  >
                    <IoTrash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
