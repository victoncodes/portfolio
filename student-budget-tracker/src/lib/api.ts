import { ApiResponse, AuthTokens } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async refreshToken(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data: ApiResponse<AuthTokens> = await response.json();
        if (data.success && data.data) {
          this.setTokens(data.data);
          return true;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && this.accessToken) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the request with new token
          headers.Authorization = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          return retryResponse.json();
        } else {
          // Refresh failed, clear tokens and redirect to login
          this.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; tokens: AuthTokens }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ user: any; tokens: AuthTokens }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Transaction endpoints
  async getTransactions(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/transactions${queryString}`);
  }

  async createTransaction(data: any) {
    return this.request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: any) {
    return this.request<any>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<any>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactionStats(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/transactions/stats${queryString}`);
  }

  // Goal endpoints
  async getGoals() {
    return this.request<any>('/goals');
  }

  async createGoal(data: any) {
    return this.request<any>('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGoal(id: string, data: any) {
    return this.request<any>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addToGoal(id: string, amount: number) {
    return this.request<any>(`/goals/${id}/add`, {
      method: 'PATCH',
      body: JSON.stringify({ amount }),
    });
  }

  async deleteGoal(id: string) {
    return this.request<any>(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  async getGoalStats() {
    return this.request<any>('/goals/stats');
  }

  // Course endpoints
  async getCourses(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/courses${queryString}`);
  }

  async getCourse(id: string) {
    return this.request<any>(`/courses/${id}`);
  }

  async enrollInCourse(id: string) {
    return this.request<any>(`/courses/${id}/enroll`, {
      method: 'POST',
    });
  }

  async getUserCourses() {
    return this.request<any>('/courses/my/enrolled');
  }

  async getCourseLessons(id: string) {
    return this.request<any>(`/courses/${id}/lessons`);
  }

  async getCourseProgress(id: string) {
    return this.request<any>(`/courses/${id}/progress`);
  }

  // Lesson endpoints
  async getLesson(id: string) {
    return this.request<any>(`/lessons/${id}`);
  }

  async markLessonComplete(id: string) {
    return this.request<any>(`/lessons/${id}/complete`, {
      method: 'POST',
    });
  }

  // Dashboard endpoints
  async getDashboardStats(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/dashboard/stats${queryString}`);
  }

  async getFinancialInsights() {
    return this.request<any>('/dashboard/insights');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;