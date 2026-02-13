import { apiClient } from '@/lib/api-client';

export interface Shop {
    id: number;
    user_id: number;
    type: number;
    title: string;
    created_at: string;
    updated_at: string;
    is_active?: boolean;
    marketplace?: MarketplaceInfo;
    // Plugin-specific fields
    identifier?: string;
    logo?: string;
    vendor_id?: number;
    vendor_status?: number;
    webhook_count?: number;
}

export interface MarketplaceInfo {
    id: number;
    slug: string;
    title: string;
}

export interface Marketplace {
    id: number;
    slug: string;
    title: string;
}

export interface ShopsResponse {
    shops: Shop[];
    total: number;
}

export interface InitConnectionResponse {
    auth_url: string;
}

export interface ShopType {
    id: number;
    slug: string;
    title: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
}

export interface InitShopConnectionResponse {
    success: boolean;
    message: string;
    data: {
        status: 'oauth' | 'api_key' | 'coming_soon';
        auth_url?: string;
        shop_type?: ShopType;
    } | null;
}

class ShopService {
    /**
     * Get user's shops with connection status
     */
    async getShops(): Promise<ShopsResponse> {
        const response = await apiClient.get<{ data: ShopsResponse }>('/shops/with-status');
        return response.data || { shops: [], total: 0 };
    }

    /**
     * Get available marketplaces from shop_types table
     */
    async getMarketplaces(): Promise<Marketplace[]> {
        const response = await apiClient.get<{ data: Marketplace[] }>('/shops/marketplaces');
        return response.data || [];
    }

    /**
     * Get all available shop types from shop_types table
     */
    async getShopTypes(): Promise<ShopType[]> {
        const response = await apiClient.get<{ data: ShopType[] }>('/shops/types') as any;
        // Backend returns {status, message, data: [...]}
        // handleResponse already extracts response.data, so response is the shop types array
        return Array.isArray(response) ? response : [];
    }

    /**
     * Initialize connection for a shop type
     */
    async initConnection(shopTypeId: number): Promise<InitShopConnectionResponse> {
        const response = await apiClient.post<{ data: InitShopConnectionResponse }>(
            `/shops/connect/init?shop_type_id=${shopTypeId}`
        );
        return response.data as InitShopConnectionResponse;
    }

    /**
     * Initiate OAuth connection for a specific marketplace (deprecated - use initConnection)
     */
    async initBasalamConnection(): Promise<InitConnectionResponse> {
        const response = await apiClient.post<{ data: InitConnectionResponse }>('/shops/basalam/init');
        return response.data as InitConnectionResponse;
    }

    /**
     * Disconnect a shop (soft delete)
     */
    async disconnectShop(shopId: number): Promise<void> {
        // Use core shop disconnect endpoint
        await apiClient.delete(`/shops/${shopId}`);
    }
}

export const shopService = new ShopService();
