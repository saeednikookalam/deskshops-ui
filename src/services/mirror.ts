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

export interface ShopStatusItem {
  shop_id: number;
  status: number;
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
  async getMirrorShopStatus(): Promise<ShopStatusItem[]> {
    try {
      const response = await apiClient.get<ShopStatusItem[]>('/plugins/mirror/get_mirror_shop_status');
      return response || [];
    } catch (error) {
      console.error('Error fetching mirror shop status:', error);
      return [];
    }
  }

  async getShops(): Promise<Shop[]> {
    const [shopsResponse, statusList] = await Promise.all([
      apiClient.getWithMeta<Shop[]>('/shops'),
      this.getMirrorShopStatus()
    ]);

    const shops = shopsResponse.data || [];

    // Create a map of shop_id to status for quick lookup
    const statusMap = new Map<number, number>();
    statusList.forEach((item) => {
      statusMap.set(item.shop_id, item.status);
    });

    // Merge status into shops
    const shopsWithStatus = shops.map((shop) => ({
      ...shop,
      status: statusMap.get(shop.id) || 1 // Default to 1 (not connected) if no status found
    }));

    return shopsWithStatus;
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
