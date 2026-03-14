import api from "../axios.js";

export const courseService = {
  getAll: () => api.get("/courses"),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getProgress: (id) => api.get(`/courses/${id}/progress`),
  togglePublic: (id) => api.patch(`/courses/${id}/toggle-public`),
  getPublicCourses: (page, limit, search) =>
    api.get("/courses/public", { params: { page, limit, search } }),
  getPublicCourse: (id) => api.get(`/courses/public/${id}`),
  clonePublicCourse: (id) => api.post(`/courses/${id}/clone`),
};
