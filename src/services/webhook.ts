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
            // پیام خطا رو از API بگیر اگه وجود داشت
            const errorMessage = error instanceof Error && error.message ? error.message : 'خطا در دریافت وضعیت webhook';
            throw new Error(errorMessage);
        }
    }

    /**
     * فعال‌سازی webhook
     * از endpoint: POST /plugins/webhook/activate
     * Response: {url: string, api_key: string|null, is_active: boolean}
     */
    async activateWebhook(): Promise<{ success: boolean; apiRoute?: string; apiSecretKey?: string; message?: string }> {
        try {
            const data = await apiClient.postWithFullResponse<WebhookApiResponse>('/plugins/webhook/activate');

            if (!data.data) {
                return {
                    success: false,
                    message: data.message || 'پاسخ نامعتبر از سرور'
                };
            }

            return {
                success: data.data.is_active,
                apiRoute: data.data.url,
                apiSecretKey: data.data.api_key || undefined,
                message: data.message
            };
        } catch (error) {
            console.error('Error activating webhook:', error);
            const errorMessage = error instanceof Error && error.message ? error.message : 'خطا در فعال‌سازی webhook';
            return {
                success: false,
                message: errorMessage
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
            const response = await apiClient.postWithFullResponse('/plugins/webhook/deactivate');
            return {
                success: true,
                message: response.message || 'webhook با موفقیت غیرفعال شد'
            };
        } catch (error) {
            console.error('Error deactivating webhook:', error);
            const errorMessage = error instanceof Error && error.message ? error.message : 'خطا در غیرفعال‌سازی webhook';
            return {
                success: false,
                message: errorMessage
            };
        }
    }
}

export const webhookService = new WebhookService();
