// API service for making HTTP requests to the backend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make requests with proper error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Quiz endpoints
  async getQuestions() {
    return this.request('/quiz/questions');
  }

  async submitQuizResponse(answers) {
    return this.request('/quiz/responses', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getUserQuizResponses() {
    return this.request('/quiz/responses');
  }

  // Recommendations endpoints
  async getUserRecommendations() {
    return this.request('/recommendations');
  }

  async generateRecommendations() {
    return this.request('/recommendations/generate', {
      method: 'POST',
    });
  }

  // Feedback endpoints
  async submitFeedback(message) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getUserFeedback() {
    return this.request('/feedback');
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request('/users');
  }

  async getAllQuizResponses() {
    return this.request('/quiz/responses/all');
  }

  async getAllRecommendations() {
    return this.request('/recommendations/all');
  }

  async getAllFeedback() {
    return this.request('/feedback/all');
  }

  async createQuestion(questionData) {
    return this.request('/quiz/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async deleteQuestion(questionId) {
    return this.request(`/quiz/questions/${questionId}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;