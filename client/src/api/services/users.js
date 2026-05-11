import api from "../axios.js";

export const userService = {
  getProfile: () => api.get("/users"),
  deleteAccount: () => api.delete("/users"),
};
