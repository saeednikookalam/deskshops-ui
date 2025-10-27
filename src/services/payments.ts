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
    return await apiClient.get<UserBalanceData>('/payments/balance');
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
    return await apiClient.post<CreatePaymentData>('/payments/pay', data);
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