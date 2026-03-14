import React, { useEffect, useRef, useState } from "react";
import { notificationService } from "../../api/services/notifications.js";
import { Link } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getAll();
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await notificationService.markAllAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-700 rounded-full transition-all duration-300"
      >
        <IoNotifications className="w-6 h-6" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden animate-slideDown"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <div
            className="text-white p-4 flex justify-between items-center"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            }}
          >
            <h3 className="font-bold text-base">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-xs hover:underline transition font-medium"
                style={{ color: "#93c5fd" }}
              >
                {loading ? "..." : "Mark all read"}
              </button>
            )}
          </div>

          <div
            className="overflow-y-auto max-h-80"
            style={{ scrollbarWidth: "thin" }}
          >
            {notifications.length === 0 ? (
              <div className="p-6 text-center" style={{ color: "#6b7280" }}>
                <IoNotifications
                  className="w-12 h-12 mx-auto mb-2"
                  style={{ color: "#d1d5db" }}
                />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={notif._id}
                  to={notif.link}
                  onClick={() => {
                    if (!notif.isRead) handleMarkAsRead(notif._id);
                    setIsOpen(false);
                  }}
                  className="block p-4 border-b hover:bg-gray-50 transition"
                  style={{
                    background: !notif.isRead ? "#eff6ff" : "white",
                    borderColor: "#e5e7eb",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <p
                      className="text-sm flex-1 pr-2"
                      style={{
                        color: "#1f2937",
                        fontWeight: !notif.isRead ? "600" : "400",
                      }}
                    >
                      {notif.message}
                    </p>
                    {!notif.isRead && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0 mt-1"
                        style={{ background: "#3b82f6" }}
                      ></span>
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
                    {formatTime(notif.createdAt)}
                  </p>
                </Link>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block p-4 text-center text-sm font-semibold hover:bg-gray-50 border-t transition"
              style={{ color: "#2563eb", borderColor: "#e5e7eb" }}
            >
              View all notifications
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
