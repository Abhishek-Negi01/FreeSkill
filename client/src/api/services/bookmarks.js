import api from "../axios.js";

export const bookmarkServices = {
  getAll: () => api.get("/bookmarks"),
  toggle: (questionId) => api.patch(`/bookmarks/${questionId}`),
};
