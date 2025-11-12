import { apiClient } from '@/lib/api-client';
import { saveTokens, clearTokens } from '@/lib/token-manager';
import { pluginMenuManager } from '@/lib/plugin-menu-manager';
import { ApiResponse } from '@/types/api';

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpData {
  otp?: string;
  expires_in?: number;
}

export type SendOtpResponse = ApiResponse<SendOtpData>;

export interface VerifyOtpRequest {
  phone: string;
  otp_code: string;
}

export interface AuthData {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export type VerifyOtpResponse = ApiResponse<AuthData>;

export interface User {
  id: string;
  phone: string;
  name?: string | null;
  [key: string]: unknown;
}

export interface UserSession {
  id: string;
  created_at: string;
  last_activity: string;
  [key: string]: unknown;
}

class AuthService {
  async sendOtp(data: SendOtpRequest): Promise<SendOtpData> {
    return await apiClient.authRequest<SendOtpData>('/auth/send-otp', data);
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<AuthData> {
    const result = await apiClient.authRequest<AuthData>('/auth/verify-otp', data);

    // Store tokens in both localStorage and cookie if login successful
    if (result.access_token) {
      saveTokens(
        result.access_token,
        result.token_type || 'Bearer',
        result.refresh_token
      );
    }

    return result;
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if authenticated
      if (this.isAuthenticated()) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      // Even if logout API fails, clear local tokens
      console.warn('Logout API failed, but clearing local tokens:', error);
    } finally {
      this.clearTokensLocal();
    }
  }

  async logoutAll(): Promise<void> {
    try {
      // Call logout all endpoint if authenticated
      if (this.isAuthenticated()) {
        await apiClient.post('/auth/logout-all');
      }
    } catch (error) {
      // Even if logout API fails, clear local tokens
      console.warn('Logout all API failed, but clearing local tokens:', error);
    } finally {
      this.clearTokensLocal();
    }
  }

  private clearTokensLocal(): void {
    clearTokens();
    // Clear plugin menus when logging out
    if (typeof window !== 'undefined') {
      pluginMenuManager.clearMenus();
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  async getCurrentUser(): Promise<User> {
    return await apiClient.get('/auth/whoami');
  }

  async getUserSessions(): Promise<UserSession[]> {
    return await apiClient.get('/auth/sessions');
  }

  async updateName(name: string): Promise<User> {
    return await apiClient.put('/auth/update-name', { name });
  }
}

export const authService = new AuthService();