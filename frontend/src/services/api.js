import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add request interceptor to include auth token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const authAPI = {
  register: async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      return { success: true, ...res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Registration failed" };
    }
  },

  login: async (userData) => {
    try {
      const res = await api.post("/auth/login", userData);
      return { success: true, ...res.data };
    } catch (err) {
      if (err.response) {
        return { 
          success: false, 
          error: err.response.data?.error || err.response.data?.message || "Login failed" 
        };
      } else if (err.request) {
        return { 
          success: false, 
          error: "Network error. Please check your connection." 
        };
      } else {
        return { 
          success: false, 
          error: "An unexpected error occurred." 
        };
      }
    }
  },

verifyToken: async (token) => {
  try {
    const res = await api.get("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success && res.data.user) {
      return { success: true, user: res.data.user };
    } else {
      return { success: false, error: res.data.error || "Token invalid" };
    }

  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.error || "Token verification failed" 
    };
  }
}}


// Lessons API//
export const lessonsAPI = {
  getCourseTree: () => api.get('/lessons/lesson'), // <--- matches backend
  getLessons: (params) => api.get('/lessons', { params }),
  getLesson: (id) => api.get(`/lessons/${id}`),
  completeLesson: (id, data) => api.post(`/lessons/${id}/complete`, data),
};


export const fetchLessons = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/lessons');
    return res.data; // <-- must be { courseData: [...] }
  } catch (err) {
    console.error('Error fetching lessons from API:', err);
    return { courseData: [] }; // fallback to empty array
  }
};

export const fetchLessonById = async (id) => {
  const response = await api.get(`/lessons/${id}`);
  return response.data.lesson;
};

// Activities API
export const activitiesAPI = {
  getActivities: (params) => api.get('/activities', { params }),
};

// ---------------- NEW: AI Tutor API ----------------
export const aiTutorAPI = {
  getConversation: async () => {
    const res = await api.get("/aitutor/conversation");
    return res.data;
  },
  chatWithTutor: async (message) => {
    const res = await api.post("/aitutor/chat", { message });
    return res.data;
  },
  clearConversation: async () => {
    const res = await api.post("/aitutor/clear");
    return res.data;
  },
};



// ---------------- COMMUNITY API ----------------
// ---------------- COMMUNITY API ----------------
export const communityAPI = {
  getPosts: async (type = null) => {
    try {
      const res = await api.get('/community', { params: { type } });
      return res.data; 
    } catch (err) {
      return []; 
    }
  },

  createPost: async (data) => {
    try {
      const res = await api.post('/community', data);
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Post creation failed" };
    }
  },
likePost: async (postId) => {
  try {
    const res = await api.post(`/community/${postId}/like`);
    return res.data;
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.error || "Like failed",
      liked: false 
    };
  }
},

  addComment: async (postId, content) => {
    try {
      const res = await api.post(`/community/${postId}/comment`, { content });
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Comment failed" };
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/community/stats');
      return res.data;
    } catch (err) {
      return { success: false, error: "Failed to fetch stats" };
    }
  },

 getUserStats: async () => {  
    try {
      const res = await api.get('/community/user-stats');
      return res.data;
    } catch (err) {
      return { success: false, error: "Failed to fetch user stats" };
    }
  }
};

export const getUserProgress = (userId) => api.get(`/progress/${userId}`);
export const updateUserProgress = (data) => api.post("/progress/update", data);
export const addWeeklyProgress = (data) => api.post("/progress/weekly", data);
export default api;