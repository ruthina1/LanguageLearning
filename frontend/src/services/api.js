import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

//   interceptor to include auth token automatically
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


// lessons
export const lessonsAPI = {
  getCourseTree: () => api.get('/lessons/lesson'),
  getLessons: (params) => api.get('/lessons', { params }),
  getLesson: (id) => api.get(`/lessons/${id}`),
  completeLesson: (id, data) => api.post(`/lessons/${id}/complete`, data),
};


export const fetchLessons = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/lessons');
    return res.data;
  } catch (err) {
    console.error('Error fetching lessons from API:', err);
    return { courseData: [] }; 
  }
};

export const fetchLessonById = async (id) => {
  const response = await api.get(`/lessons/${id}`);
  return response.data.lesson;
};

// activities
export const activitiesAPI = {
  getActivities: (params) => api.get('/activities', { params }),
};


// dashboard
export const dashboardAPI = {
  getDashboardData: () => 
    api.get('/dashboard'),
  
  updateProgress: (progressData) => 
    api.post('/dashboard/progress', progressData),
  
  getPracticeStats: () => 
    api.get('/dashboard/practice-stats'),
  
  getSuggestedLessons: () => 
    api.get('/dashboard/suggested-lessons')
};

// ai tutor API - updated to match backend routes

// CORRECTED api.js - Remove the leading slashes
export const aiTutorAPI = {
  // Conversations
  getConversations: () => api.get('ai-tutor/conversations'),
  createConversation: (title) => api.post('ai-tutor/conversations', { title }),
  getMessages: (conversationId) => api.get(`ai-tutor/conversations/${conversationId}/messages`),
  sendMessage: (data) => api.post('ai-tutor/conversations/message', data),
  deleteConversation: (conversationId) => api.delete(`ai-tutor/conversations/${conversationId}`),
  
  // Grammar
  analyzeGrammar: (text) => api.post('ai-tutor/grammar/analyze', { text }),
  getGrammarAnalyses: () => api.get('ai-tutor/grammar/analyses'),
  getGrammarAnalysis: (analysisId) => api.get(`ai-tutor/grammar/analyses/${analysisId}`),
  
  // Pronunciation
  evaluatePronunciation: (data) => api.post('ai-tutor/pronunciation/evaluate', data),
  getPronunciationEvaluations: () => api.get('ai-tutor/pronunciation/evaluations'),
  getPronunciationEvaluation: (evaluationId) => api.get(`ai-tutor/pronunciation/evaluations/${evaluationId}`),
  
  // Progress
  getAIProgress: () => api.get('ai-tutor/progress'),
  getAIStats: () => api.get('ai-tutor/progress/stats'),
  updateAIStreak: () => api.post('ai-tutor/progress/streak')
};


// community
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
      console.log('API - Sending create post request:', data);
      const res = await api.post('/community', data);
      console.log('API - Create post response:', res.data);
      return res.data;
    } catch (err) {
      console.error('API - Create post error:', err.response?.data || err.message);
      return { 
        success: false, 
        error: err.response?.data?.error || "Post creation failed" 
      };
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



// Profile API calls

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  updateGoals: (goalsData) => api.put('/profile/goals', goalsData),
};
export default api;