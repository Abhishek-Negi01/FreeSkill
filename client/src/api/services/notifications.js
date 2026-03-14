import api from "../axios.js";

export const notificationService = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/mark-all-read"),
  delete: (id) => api.delete(`/notifications/${id}`),
};
