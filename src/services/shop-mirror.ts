import { apiClient } from '@/lib/api-client';

export interface Shop {
  id: number;
  user_id: number;
  type: number;
  title: string;
  identifier?: string;
  logo?: string;
  created_at: string;
  updated_at: string;
}

export interface ShopMirrorTarget {
  id: number;
  target_shop_id: number;
  shop_title: string;
  identifier?: string;
  is_active: boolean;
}

export interface ShopMirrorConfig {
  id: number;
  user_id: number;
  source_shop_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  targets: ShopMirrorTarget[];
}

export interface ShopMirrorStatus {
  isConfigured: boolean;
  hasSource: boolean;
  hasTargets: boolean;
  sourceShopId?: number;
  targetShopIds: number[];
  isActive: boolean;
}

export interface ConfigResponse {
  status: number;
  message: string;
  data: ShopMirrorConfig | null;
}

export interface AvailableShopsResponse {
  status: number;
  message: string;
  data: Shop[];
}

export interface UpdateConfigRequest {
  source_shop_id: number;
  target_shop_ids: number[];
  is_active?: boolean;
}

export interface FailureRecord {
  id: number;
  target_shop_id: number;
  sku: string;
  operation: string;
  error_message: string;
  retry_count: number;
  status: 'pending' | 'retrying' | 'dead_letter' | 'resolved';
  created_at: string;
}

export interface FailuresResponse {
  status: number;
  message: string;
  data: {
    failures: FailureRecord[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
  };
}

class ShopMirrorService {
  /**
   * Get current shop mirror configuration
   */
  async getConfig(): Promise<ShopMirrorConfig | null> {
    try {
      // apiClient extracts the 'data' field automatically
      const data = await apiClient.get<ShopMirrorConfig | null>('/plugins/shop-mirror/config');
      return data;
    } catch (error) {
      console.error('Error fetching config:', error);
      return null;
    }
  }

  /**
   * Get available Basalam shops for user
   */
  async getAvailableShops(): Promise<Shop[]> {
    try {
      // apiClient extracts the 'data' field automatically
      const data = await apiClient.get<Shop[]>('/plugins/shop-mirror/available-shops');
      return data || [];
    } catch (error) {
      console.error('Error fetching available shops:', error);
      return [];
    }
  }

  /**
   * Update shop mirror configuration
   */
  async updateConfig(config: UpdateConfigRequest): Promise<ShopMirrorConfig> {
    const response = await apiClient.putWithFullResponse<ShopMirrorConfig>(
      '/plugins/shop-mirror/config',
      config
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.message || 'خطا در ذخیره تنظیمات');
    }
    return response.data!;
  }

  /**
   * Get configuration status
   * Returns whether the plugin is properly configured
   */
  getConfigStatus(config: ShopMirrorConfig | null): ShopMirrorStatus {
    if (!config) {
      return {
        isConfigured: false,
        hasSource: false,
        hasTargets: false,
        targetShopIds: [],
        isActive: false
      };
    }

    const targetShopIds = config.targets?.map(t => t.target_shop_id) || [];

    return {
      isConfigured: Boolean(config.source_shop_id && targetShopIds.length > 0),
      hasSource: Boolean(config.source_shop_id),
      hasTargets: targetShopIds.length > 0,
      sourceShopId: config.source_shop_id,
      targetShopIds,
      isActive: config.is_active
    };
  }

  /**
   * Check if plugin is valid for operation
   * Requires: 1 source + at least 1 target
   */
  isValidForOperation(status: ShopMirrorStatus): boolean {
    return status.hasSource && status.hasTargets && status.isActive;
  }

  /**
   * Get validation message for user
   */
  getValidationMessage(status: ShopMirrorStatus | null): string {
    if (!status) {
      return 'لطفاً یک فروشگاه مبدا و حداقل یک فروشگاه مقصد انتخاب کنید';
    }
    if (!status.hasSource && !status.hasTargets) {
      return 'لطفاً یک فروشگاه مبدا و حداقل یک فروشگاه مقصد انتخاب کنید';
    }
    if (!status.hasSource) {
      return 'لطفاً یک فروشگاه مبدا انتخاب کنید';
    }
    if (!status.hasTargets) {
      return 'لطفاً حداقل یک فروشگاه مقصد انتخاب کنید';
    }
    if (!status.isActive) {
      return 'پلاگین غیرفعال است. لطفاً آن را فعال کنید';
    }
    return '';
  }

  /**
   * Get sync failures with pagination
   */
  async getFailures(page: number = 1, limit: number = 20, status?: string): Promise<FailuresResponse['data']> {
    try {
      let url = `/plugins/shop-mirror/failures?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      // apiClient extracts the 'data' field automatically
      const data = await apiClient.get<FailuresResponse['data']>(url);
      return data;
    } catch (error) {
      console.error('Error fetching failures:', error);
      return { failures: [], total: 0, page, limit, has_more: false };
    }
  }

  /**
   * Retry a specific failure
   */
  async retryFailure(failureId: number): Promise<void> {
    const response = await apiClient.postWithFullResponse(
      `/plugins/shop-mirror/failures/${failureId}/retry`,
      {}
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.message || 'خطا در تلاش مجدد');
    }
  }
}

export const shopMirrorService = new ShopMirrorService();
