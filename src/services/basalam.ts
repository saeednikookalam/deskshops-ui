import {apiClient} from '@/lib/api-client';
import {getToken} from '@/lib/token-manager';

export interface BasalamConnectionStatus {
    isConnected: boolean;
    shopName?: string;
    shopIcon?: string;
    shopId?: string;
}

export interface BasalamOAuthConfig {
    clientId: string;
    redirectUri: string;
    scopes: string[];
}

export class BasalamService {
    private readonly BASALAM_AUTH_URL = 'https://basalam.com/accounts/sso';
    private readonly BASALAM_CLIENT_ID = '1391';
    private readonly BASALAM_REDIRECT_URI = 'https://api.deskshops.ir/plugins/basalam/login';

    private readonly DEFAULT_SCOPES = [
        'order-processing',                 // دسترسی کامل به سفارشات
        'vendor.profile.read',              // مشاهده اطلاعات عمومی و خصوصی غرفه
        'vendor.profile.write',             // مشاهده و ویرایش اطلاعات غرفه
        'vendor.product.read',              // مشاهده اطلاعات محصولات
        'vendor.product.write',             // مشاهده و ویرایش محصولات
        'vendor.parcel.read',               // مشاهده اطلاعات سفارش‌های غرفه
        'vendor.parcel.write',              // مشاهده و ویرایش سفارش‌های غرفه
        'customer.profile.read',            // مشاهده اطلاعات مشتریان
        'customer.profile.write',           // مشاهده و ویرایش اطلاعات مشتریان
        'customer.order.read',              // مشاهده خریدهای مشتری
        'customer.order.write',             // مشاهده و ویرایش خریدهای مشتری
        'customer.wallet.read',             // مشاهده کیف پول مشتری
        'customer.wallet.write',            // مشاهده و شارژ کیف پول مشتری
        'customer.chat.read',               // مشاهده گفت‌وگوها
        'customer.chat.write'               // ارسال گفت‌وگو
    ];

    async getConnectionStatus(userId?: string): Promise<BasalamConnectionStatus> {
        try {
            // Get user ID from token if not provided
            let userIdToUse = userId;
            if (!userIdToUse && typeof window !== 'undefined') {
                const token = getToken();
                if (token) {
                    // Decode JWT to get user ID (assuming it's in the token)
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        userIdToUse = payload.user_id || payload.sub || payload.id;
                    } catch (e) {
                        console.error('Error parsing token:', e);
                    }
                }
            }

            if (!userIdToUse) {
                return {isConnected: false};
            }

            // API response format: { user: { title: "...", logo: "..." } }
            const data = await apiClient.get<{ user?: { title: string; logo: string } }>(
                `/plugins/basalam/check-user/${userIdToUse}`
            );

            // Transform API response to our format
            if (data && data.user) {
                return {
                    isConnected: true,
                    shopName: data.user.title,
                    shopIcon: data.user.logo
                };
            }

            return {isConnected: false};
        } catch (error) {
            console.error('Error fetching Basalam connection status:', error);
            return {
                isConnected: false
            };
        }
    }

    getAuthUrl(config: Partial<BasalamOAuthConfig> = {}): string {
        // Use environment variable if available, fallback to hardcoded (for security)
        const clientId = process.env.NEXT_PUBLIC_BASALAM_CLIENT_ID || this.BASALAM_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_BASALAM_REDIRECT_URI || this.BASALAM_REDIRECT_URI;
        const scopes = config.scopes || this.DEFAULT_SCOPES;

        // Get user ID from token
        let userId = '';
        if (typeof window !== 'undefined') {
            const token = getToken();
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    userId = payload.user_id || payload.sub || payload.id || '';
                } catch (e) {
                    console.error('Error parsing token for user ID:', e);
                }
            }
        }

        // Create state with CSRF token and user_id
        const csrfToken = this.generateState();
        const stateData = {
            csrf: csrfToken,
            user_id: userId,
            timestamp: Date.now()
        };

        // Encode state as base64
        const state = btoa(JSON.stringify(stateData));

        // Store state for CSRF protection
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('basalam_oauth_state', state);
            // Also store timestamp for expiry check
            sessionStorage.setItem('basalam_oauth_timestamp', Date.now().toString());
        }

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: scopes.join(' '),
            state: state,
            response_type: 'code'
        });

        return `${this.BASALAM_AUTH_URL}?${params.toString()}`;
    }

    private generateState(): string {
        // More secure state generation
        const array = new Uint8Array(32);
        if (typeof window !== 'undefined' && window.crypto) {
            window.crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        }
        // Fallback for older browsers
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Date.now().toString(36);
    }

    // Verify state for CSRF protection and extract user_id
    verifyState(state: string): { valid: boolean; userId?: string } {
        if (typeof window === 'undefined') return {valid: false};

        const storedState = sessionStorage.getItem('basalam_oauth_state');
        const timestamp = sessionStorage.getItem('basalam_oauth_timestamp');

        // Clear stored values
        sessionStorage.removeItem('basalam_oauth_state');
        sessionStorage.removeItem('basalam_oauth_timestamp');

        if (!storedState || !timestamp) return {valid: false};

        // Check if state matches
        if (storedState !== state) return {valid: false};

        // Try to decode and validate state
        try {
            const stateData = JSON.parse(atob(state));

            // Check if state is not expired (5 minutes)
            const elapsed = Date.now() - stateData.timestamp;
            if (elapsed > 5 * 60 * 1000) return {valid: false};

            return {
                valid: true,
                userId: stateData.user_id
            };
        } catch (e) {
            console.error('Error decoding state:', e);
            return {valid: false};
        }
    }

    async disconnectShop(): Promise<void> {
        try {
            await apiClient.post('/api/basalam/disconnect');
        } catch (error) {
            console.error('Error disconnecting Basalam shop:', error);
            throw error;
        }
    }

    async getShopInfo(): Promise<{
        shopName: string;
        shopIcon: string;
        products: number;
        orders: number;
    } | null> {
        try {
            return await apiClient.get<{
                shopName: string;
                shopIcon: string;
                products: number;
                orders: number;
            }>('/api/basalam/shop-info');
        } catch (error) {
            console.error('Error fetching shop info:', error);
            return null;
        }
    }
}

export const basalamService = new BasalamService();