const API_BASE_URL = 'http://127.0.0.1:8000';

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
  token_type?: string;
}

class AuthService {
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Store tokens in localStorage and cookie if login successful
    if (result.success && result.access_token) {
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('token_type', result.token_type || 'bearer');

      // Set cookie for middleware
      document.cookie = `access_token=${result.access_token}; path=/; max-age=86400; SameSite=Lax`;
    }

    return result;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');

    // Remove cookie
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();