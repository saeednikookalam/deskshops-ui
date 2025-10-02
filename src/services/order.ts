import { apiClient } from '@/lib/api-client';

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  source: string;
  source_logo?: string;
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
    const data = await apiClient.get<OrderListResponse>(
      `/api/orders/list?page=${page}&per_page=${perPage}`
    );
    return data;
  }

  async getOrderById(id: number): Promise<Order> {
    return await apiClient.get<Order>(`/api/orders/${id}`);
  }

  async updateOrderStatus(
    id: number,
    status: Order['status']
  ): Promise<{ success: boolean; message: string }> {
    return await apiClient.put(`/api/orders/${id}/status`, { status });
  }
}

export const orderService = new OrderService();
