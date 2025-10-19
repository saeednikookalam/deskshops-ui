import {apiClient} from '@/lib/api-client';

export interface WebhookStatus {
    isActive: boolean;
    apiRoute?: string;
    apiSecretKey?: string;
}

// Response type از API
interface WebhookApiResponse {
    url: string;
    api_key: string | null;
    is_active: boolean;
}

export class WebhookService {
    /**
     * دریافت وضعیت فعلی webhook
     * از endpoint: GET /plugins/webhook/
     */
    async getWebhookStatus(): Promise<WebhookStatus> {
        try {
            const response = await apiClient.get<WebhookApiResponse>('/plugins/webhook/');

            return {
                isActive: response.is_active,
                apiRoute: response.url,
                apiSecretKey: response.api_key || undefined
            };
        } catch (error) {
            console.error('Error fetching webhook status:', error);
            return {
                isActive: false
            };
        }
    }

    /**
     * فعال‌سازی webhook
     * از endpoint: POST /plugins/webhook/activate
     * Response: {url: string, api_key: string|null, is_active: boolean}
     */
    async activateWebhook(): Promise<{ success: boolean; apiRoute?: string; apiSecretKey?: string; message?: string }> {
        try {
            const response = await apiClient.post<WebhookApiResponse>('/plugins/webhook/activate');

            return {
                success: response.is_active,
                apiRoute: response.url,
                apiSecretKey: response.api_key || undefined
            };
        } catch (error) {
            console.error('Error activating webhook:', error);
            return {
                success: false,
                message: 'خطا در فعال‌سازی webhook'
            };
        }
    }

    /**
     * غیرفعال‌سازی webhook
     * از endpoint: POST /plugins/webhook/deactivate
     * Response: {} (empty object)
     */
    async deactivateWebhook(): Promise<{ success: boolean; message?: string }> {
        try {
            await apiClient.post('/plugins/webhook/deactivate');
            return {
                success: true
            };
        } catch (error) {
            console.error('Error deactivating webhook:', error);
            return {
                success: false,
                message: 'خطا در غیرفعال‌سازی webhook'
            };
        }
    }
}

export const webhookService = new WebhookService();
