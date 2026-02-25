import api from "../axios.js";

export const videoServices = {
  getAll: (courseId) => api.get(`/videos/${courseId}`),
  getById: (videoId) => api.patch(`/videos/${videoId}`),
  addVideo: (courseId, videoData) => api.post(`/videos/${courseId}`, videoData),
  markCompleted: (videoId) => api.patch(`/videos/${videoId}/complete`),
  deleteVideo: (videoId) => api.delete(`/videos/${videoId}`),
};
