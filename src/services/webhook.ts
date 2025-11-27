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
            const data = await apiClient.get<WebhookApiResponse>('/plugins/webhook/');

            // اگر data وجود نداشته باشد، webhook فعال نیست
            if (!data) {
                return {
                    isActive: false
                };
            }

            return {
                isActive: data.is_active,
                apiRoute: data.url,
                apiSecretKey: data.api_key || undefined
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
            const data = await apiClient.post<WebhookApiResponse>('/plugins/webhook/activate');

            if (!data) {
                return {
                    success: false,
                    message: 'پاسخ نامعتبر از سرور'
                };
            }

            return {
                success: data.is_active,
                apiRoute: data.url,
                apiSecretKey: data.api_key || undefined
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
