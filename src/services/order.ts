import { apiClient } from '@/lib/api-client';

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  source: string;
  source_logo?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  per_page: number;
}

class OrderService {
  async getOrders(page: number = 1, perPage: number = 20): Promise<OrderListResponse> {
    return await apiClient.get<OrderListResponse>(
      `/api/orders/list?page=${page}&per_page=${perPage}`
    );
  }

  async getOrderById(id: number): Promise<Order> {
    return await apiClient.get<Order>(`/api/orders/${id}`);
  }

  async updateOrderStatus(
    id: number,
    status: Order['status']
  ): Promise<void> {
    await apiClient.put(`/api/orders/${id}/status`, { status });
  }
}

export const orderService = new OrderService();
