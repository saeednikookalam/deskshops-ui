import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

export interface CreatePaymentRequest {
  amount: number;
  description?: string;
  phone?: string;
  email?: string;
}

export interface CreatePaymentData {
  payment_url?: string;
  authority?: string;
}

export type CreatePaymentResponse = ApiResponse<CreatePaymentData>;

export interface UserBalanceData {
  balance: number;
}

export type UserBalanceResponse = ApiResponse<UserBalanceData>;

export interface CreditItem {
  id: number;
  user_id: number;
  entity_type: number;
  entity_id: number;
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreditListData {
  credits: CreditItem[];
  total_count: number;
  has_more: boolean;
}

export type CreditListResponse = ApiResponse<CreditListData>;

export interface PaymentCallbackParams {
  Authority: string;
  Status: string;
}

class PaymentsService {
  /**
   * Get user balance
   */
  async getBalance(): Promise<UserBalanceData> {
    const response = await apiClient.get<UserBalanceData | { balance: number } | number>('/payments/balance');

    // Handle different response formats
    if (typeof response === 'number') {
      return { balance: response };
    }
    if (response && typeof response === 'object' && 'balance' in response) {
      return { balance: response.balance };
    }

    return { balance: 0 };
  }

  /**
   * Get user credits list with pagination
   */
  async getCredits(limit: number = 20, offset: number = 0): Promise<CreditListData> {
    const response = await apiClient.getWithMeta<CreditItem[]>(`/payments/?limit=${limit}&offset=${offset}`);

    // API returns array in data and pagination info in meta
    return {
      credits: response.data || [],
      total_count: (response.meta?.total as number) || 0,
      has_more: (response.meta?.has_more as boolean) || false
    };
  }

  /**
   * Create a new payment request
   */
  async createPayment(data: CreatePaymentRequest): Promise<CreatePaymentData> {
    const response = await apiClient.post<CreatePaymentData | { payment_url?: string; authority?: string }>('/payments/pay', data);

    // Handle different response formats
    if (response && typeof response === 'object') {
      return {
        payment_url: response.payment_url,
        authority: response.authority
      };
    }

    return {};
  }

  /**
   * Handle payment callback from Zarinpal
   */
  async handleCallback(params: PaymentCallbackParams): Promise<unknown> {
    const queryParams = new URLSearchParams({
      Authority: params.Authority,
      Status: params.Status,
    });
    
    return await apiClient.get(`/payments/callback?${queryParams.toString()}`);
  }

  /**
   * Get payment callback URL for Zarinpal
   */
  getCallbackUrl(): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/payment/result`;
    }
    return '/payment/result';
  }
}

export const paymentsService = new PaymentsService();