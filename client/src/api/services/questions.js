import api from "../axios.js";

export const questionService = {
  getAll: () => api.get("/questions"),
  getById: (id) => api.get(`/questions/${id}`),
  getByVideo: (videoId) => api.get(`/questions/video/${videoId}`),
  create: (data) => api.post("/questions", data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  upvote: (id) => api.patch(`/questions/${id}/upvote`),
  downvote: (id) => api.patch(`/questions/${id}/downvote`),
};
