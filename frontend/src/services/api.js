import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for long-running CrewAI analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Get API information
  getApiInfo: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // Get available cities
  getCities: async () => {
    const response = await api.get('/cities/');
    return response.data;
  },

  // Analyze uploaded image only
  analyzeImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await api.post('/analyze-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Run disaster analysis for specific city
  analyzeCityById: async (cityId) => {
    const response = await api.get(`/analyze-city/${cityId}`);
    return response.data;
  },

  // Complete workflow: image analysis + CrewAI
  completeAnalysis: async (imageFile, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await api.post('/complete-analysis/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Test analysis with default image
  testAnalysis: async () => {
    const response = await api.get('/test-analysis/');
    return response.data;
  },
};

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.detail || error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'No response from server. Please check if the API is running.',
      status: 0,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null,
    };
  }
};

export default api;