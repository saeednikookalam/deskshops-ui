import { apiClient } from '@/lib/api-client';
import { saveTokens, clearTokens } from '@/lib/token-manager';
import { pluginMenuManager } from '@/lib/plugin-menu-manager';

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  otp?: string;
  expires_in?: number;
}

export interface VerifyOtpRequest {
  phone: string;
  otp_code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}

class AuthService {
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    return await apiClient.authRequest('/auth/send-otp', data);
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const result = await apiClient.authRequest('/auth/verify-otp', data);

    // Store tokens in both localStorage and cookie if login successful
    if (result.success && result.access_token) {
      saveTokens(result.access_token, result.token_type || 'Bearer', result.refresh_token);
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

  async getCurrentUser(): Promise<any> {
    return await apiClient.get('/auth/whoami');
  }

  async getUserSessions(): Promise<any> {
    return await apiClient.get('/auth/sessions');
  }
}

export const authService = new AuthService();