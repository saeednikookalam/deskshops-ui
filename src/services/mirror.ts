import { apiClient } from '@/lib/api-client';

export interface Shop {
  id: number;
  user_id: number;
  type: number;
  title: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface ShopsResponse {
  status: number;
  message: string;
  data: Shop[];
  meta: {
    total: number;
  };
}

export interface MirrorActionResponse {
  status: number;
  message: string;
  data?: unknown;
}

class MirrorService {
  async getShops(): Promise<Shop[]> {
    const response = await apiClient.getWithMeta<Shop[]>('/shops');
    return response.data || [];
  }

  async setAsSource(shopId: number): Promise<MirrorActionResponse> {
    const response = await apiClient.postWithFullResponse<unknown>(
      '/plugins/mirror/set_source',
      { shop_id: shopId }
    );
    return {
      status: response.status,
      message: response.message || 'فروشگاه با موفقیت به عنوان مبدا تنظیم شد',
      data: response.data
    };
  }

  async connectToSource(shopId: number): Promise<MirrorActionResponse> {
    const response = await apiClient.postWithFullResponse<unknown>(
      '/plugins/mirror/connect_to_source',
      { shop_id: shopId }
    );
    return {
      status: response.status,
      message: response.message || 'فروشگاه با موفقیت به مبدا متصل شد',
      data: response.data
    };
  }

  async disconnectFromSource(shopId: number): Promise<MirrorActionResponse> {
    const response = await apiClient.postWithFullResponse<unknown>(
      '/plugins/mirror/disconnect_from_source',
      { shop_id: shopId }
    );
    return {
      status: response.status,
      message: response.message || 'اتصال فروشگاه با موفقیت قطع شد',
      data: response.data
    };
  }
}

export const mirrorService = new MirrorService();
