import { clearTokens, getToken } from './token-manager';

const API_BASE_URL = 'http://127.0.0.1:8000';

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private clearTokensAndRedirect() {
    // حذف توکن‌ها از هر دو جا
    clearTokens();

    // فورس ریدایرکت به لاگین
    if (typeof window !== 'undefined') {
      // استفاده از setTimeout برای اطمینان از اینکه پاک‌سازی کامل شده
      setTimeout(() => {
        window.location.replace('/login');
      }, 100);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // اگر 401 گرفتی، توکن رو حذف کن و ریدایرکت کن
    if (response.status === 401) {
        this.clearTokensAndRedirect();
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async get<T = unknown>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(10000),
        cache: 'no-store',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      // اگر CORS یا network error، احتمالاً توکن منقضی شده
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        if (typeof window !== 'undefined' && getToken()) {
          try {
            this.clearTokensAndRedirect();
          } catch (clearError) {
            console.error('Error during token cleanup:', clearError);
          }
          return Promise.reject(new Error('Token expired, redirecting to login'));
        }
      }
      throw error;
    }
  }

  async post<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(10000),
        cache: 'no-store',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        if (typeof window !== 'undefined' && getToken()) {
          try {
            this.clearTokensAndRedirect();
          } catch (clearError) {
            console.error('Error during token cleanup:', clearError);
          }
          return Promise.reject(new Error('Token expired, redirecting to login'));
        }
      }
      throw error;
    }
  }

  async put<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(10000),
        cache: 'no-store',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        if (typeof window !== 'undefined' && getToken()) {
          try {
            this.clearTokensAndRedirect();
          } catch (clearError) {
            console.error('Error during token cleanup:', clearError);
          }
          return Promise.reject(new Error('Token expired, redirecting to login'));
        }
      }
      throw error;
    }
  }

  // برای ریکوئست‌های احراز هویت (بدون header توکن)
  async authRequest<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export const apiClient = new ApiClient();