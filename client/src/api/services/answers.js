import api from "../axios.js";

export const answerService = {
  getByQuestion: (questionId) => api.get(`/answers/question/${questionId}`),
  create: (data) => api.post("/answers", data),
  update: (id, data) => api.put(`/answers/${id}`, data),
  delete: (id) => api.delete(`/answers/${id}`),
  accept: (id) => api.patch(`/answers/${id}/accept`),
  upvote: (id) => api.patch(`/answers/${id}/upvote`),
  downvote: (id) => api.patch(`/answers/${id}/downvote`),
};
