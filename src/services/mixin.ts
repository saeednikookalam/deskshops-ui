export interface MixinShop {
    id: number;
    title: string;
    base_url: string;
    api_token: string;
    created_at?: string;
    updated_at?: string;
}

export interface MixinConnectionStatus {
    isConnected: boolean;
    shops: MixinShop[];
}

export interface MixinTestConnectionRequest {
    base_url: string;
    api_token: string;
}

export interface MixinTestConnectionResponse {
    success: boolean;
    message: string;
    shop_info?: {
        title?: string;
        version?: string;
    };
}

export interface MixinAddShopRequest {
    title: string;
    base_url: string;
    api_token: string;
}

export interface MixinUpdateTokenRequest {
    shop_id: number;
    api_token: string;
}

export class MixinService {
    // Fake data storage (in a real app, this would be API calls)
    private static fakeShops: MixinShop[] = [];
    private static nextId = 1;

    async getShops(): Promise<MixinConnectionStatus> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            isConnected: MixinService.fakeShops.length > 0,
            shops: MixinService.fakeShops
        };
    }

    async testConnection(request: MixinTestConnectionRequest): Promise<MixinTestConnectionResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validate inputs
        if (!request.base_url || !request.api_token) {
            return {
                success: false,
                message: 'لطفاً تمام فیلدها را پر کنید'
            };
        }

        // Validate URL format
        try {
            new URL(request.base_url);
        } catch {
            return {
                success: false,
                message: 'آدرس فروشگاه معتبر نیست'
            };
        }

        // Validate token length (at least 20 characters)
        if (request.api_token.length < 20) {
            return {
                success: false,
                message: 'توکن API معتبر نیست'
            };
        }

        // Simulate successful connection
        return {
            success: true,
            message: 'اتصال با موفقیت برقرار شد',
            shop_info: {
                title: 'فروشگاه نمونه',
                version: '1.0.0'
            }
        };
    }

    async addShop(request: MixinAddShopRequest): Promise<MixinShop> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Validate inputs
        if (!request.title || !request.base_url || !request.api_token) {
            throw new Error('لطفاً تمام فیلدها را پر کنید');
        }

        // Check for duplicate base_url
        const existingShop = MixinService.fakeShops.find(
            shop => shop.base_url.toLowerCase() === request.base_url.toLowerCase()
        );

        if (existingShop) {
            throw new Error('این فروشگاه قبلاً اضافه شده است');
        }

        const newShop: MixinShop = {
            id: MixinService.nextId++,
            title: request.title,
            base_url: request.base_url,
            api_token: request.api_token,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        MixinService.fakeShops.push(newShop);
        return newShop;
    }

    async updateToken(request: MixinUpdateTokenRequest): Promise<MixinShop> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const shop = MixinService.fakeShops.find(s => s.id === request.shop_id);

        if (!shop) {
            throw new Error('فروشگاه یافت نشد');
        }

        shop.api_token = request.api_token;
        shop.updated_at = new Date().toISOString();

        return shop;
    }

    async deleteShop(shopId: number): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const index = MixinService.fakeShops.findIndex(s => s.id === shopId);

        if (index === -1) {
            throw new Error('فروشگاه یافت نشد');
        }

        MixinService.fakeShops.splice(index, 1);
    }

    // Helper method to mask token for display
    maskToken(token: string): string {
        if (token.length <= 8) {
            return '••••••••';
        }
        const start = token.substring(0, 4);
        const end = token.substring(token.length - 4);
        return `${start}••••••••${end}`;
    }
}

export const mixinService = new MixinService();
