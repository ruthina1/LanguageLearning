// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/api",
});

export const authAPI = {
  register: async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      return { success: true, ...res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Registration failed" };
    }
  },

  login: async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      return { success: true, ...res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Login failed" };
    }
  },

  verifyToken: async (token) => {
    try {
      const res = await api.get("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, ...res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Token verification failed" };
    }
  },
};


export default api;