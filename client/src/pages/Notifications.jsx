import React from "react";
import useNotifications from "../hooks/api/useNotifications";
import { Link } from "react-router-dom";
import { IoNotifications, IoCheckmarkDone, IoTrash } from "react-icons/io5";

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationClick,
    formatTime,
    hasNotifications,
    hasUnread,
    isEmpty,
    notificationCount,
  } = useNotifications();

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  const handleNotifClick = async (notification) => {
    await handleNotificationClick(notification);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium" style={{ color: "#6b7280" }}>
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

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
              {hasUnread
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : hasNotifications
                  ? `All caught up! • ${notificationCount} total`
                  : "No notifications yet"}
            </p>
          </div>
          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <IoCheckmarkDone className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {isEmpty ? (
          <div
            className="bg-white rounded-xl shadow-lg p-12 text-center animate-fadeIn"
            style={{ border: "1px solid #e5e7eb" }}
          >
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
                className={`bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row justify-between gap-3 transition-all duration-300 hover:shadow-xl ${
                  !notif.isRead ? "border-l-4" : ""
                }`}
                style={{
                  borderColor: !notif.isRead ? "#3b82f6" : "transparent",
                  background: !notif.isRead ? "#eff6ff" : "white",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Link
                  to={notif.link}
                  onClick={() => handleNotifClick(notif)}
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
