import api from "../axios.js";

export const youtubeServices = {
  search: (query, pageToken) =>
    api.get("/youtube/search", { params: { query, pageToken } }),
  smartSearch: (query, type, pageToken) =>
    api.get("/youtube/smart-search", { params: { query, type, pageToken } }),
  importVideo: (courseId, videoUrl) =>
    api.post("/youtube/import-video", { courseId, videoUrl }),
  importPlaylist: (courseId, playlistUrl) =>
    api.post("/youtube/import-playlist", { courseId, playlistUrl }),
};
