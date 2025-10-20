import {clearTokens, getToken} from './token-manager';

const API_BASE_URL = 'https://api.deskshops.ir';
// const API_BASE_URL = 'http://127.0.0.1:8000';

class ApiError extends Error {
    status?: number;
    data?: unknown;

    constructor(message: string, status?: number, data?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

class ApiClient {
    private getAuthHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (typeof window !== 'undefined') {
            const token = getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    private clearTokensAndRedirect() {
        clearTokens();
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                window.location.replace('/login');
            }, 100);
        }
    }

    private async parseBodySafely(response: Response): Promise<any> {
        const text = await response.text().catch(() => '');
        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch {
            return text; // متن ساده
        }
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401 || response.status === 419) {
            // فقط در 401/419 لاگ‌اوت کن
            this.clearTokensAndRedirect();
            throw new ApiError('Unauthorized', response.status);
        }

        if (!response.ok) {
            const data = await this.parseBodySafely(response);
            const msg =
                (data && typeof data === 'object' && (data as any).message) ||
                (typeof data === 'string' ? data : null) ||
                `HTTP error ${response.status}`;
            throw new ApiError(msg, response.status, data);
        }

        // اگر بدنه خالی بود (مثلاً 204)، تلاش برای parse نکن
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type') || '';
        if (response.status === 204 || contentLength === '0' || !contentType.includes('application/json')) {
            // @ts-expect-error - وقتی بدنه JSON نیست، T ممکنه void باشه
            return undefined;
        }

        return (await response.json()) as T;
    }

    private async doFetch<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        opts?: { body?: unknown; timeout?: number; isFormData?: boolean }
    ): Promise<T> {
        try {
            const headers: Record<string, string> = opts?.isFormData ? {} : this.getAuthHeaders();

            // برای FormData، فقط Authorization رو اضافه کن
            if (opts?.isFormData && typeof window !== 'undefined') {
                const token = getToken();
                if (token) headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers,
                body: opts?.isFormData ? (opts?.body as BodyInit) : opts?.body ? JSON.stringify(opts.body) : undefined,
                signal: AbortSignal.timeout(opts?.timeout ?? 10000),
                cache: 'no-store',
            });

            return this.handleResponse<T>(response);
        } catch (error: any) {
            // ❌ دیگر اینجا لاگ‌اوت نمی‌کنیم
            if (error instanceof DOMException && error.name === 'TimeoutError') {
                throw new ApiError('درخواست شما منقضی شد. لطفاً دوباره تلاش کنید.');
            }
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                // اینترنت قطع، CORS، یا سرور در دسترس نیست
                const offline = typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine;
                const msg = offline
                    ? 'به اینترنت متصل نیستید. لطفاً اتصال خود را بررسی کنید.'
                    : 'عدم دسترسی به سرور. لطفاً بعداً دوباره تلاش کنید.';
                throw new ApiError(msg);
            }
            // اگر ApiError از handleResponse آمده، همان را پاس بده
            if (error instanceof ApiError) throw error;
            // خطای ناشناخته
            throw new ApiError(error?.message || 'خطای ناشناخته رخ داد');
        }
    }

    async get<T = unknown>(endpoint: string): Promise<T> {
        return this.doFetch<T>('GET', endpoint);
    }

    async post<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
        return this.doFetch<T>('POST', endpoint, {body});
    }

    async put<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
        return this.doFetch<T>('PUT', endpoint, {body});
    }

    async delete<T = unknown>(endpoint: string): Promise<T> {
        return this.doFetch<T>('DELETE', endpoint);
    }

    // برای ریکوئست‌های احراز هویت (بدون header توکن)
    async authRequest<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: body ? JSON.stringify(body) : undefined,
                signal: AbortSignal.timeout(10000),
                cache: 'no-store',
            });

            return this.handleResponse<T>(response);
        } catch (error: any) {
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                const offline = typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine;
                const msg = offline
                    ? 'به اینترنت متصل نیستید. لطفاً اتصال خود را بررسی کنید.'
                    : 'عدم دسترسی به سرور. لطفاً بعداً دوباره تلاش کنید.';
                throw new ApiError(msg);
            }
            if (error instanceof ApiError) throw error;
            throw new ApiError(error?.message || 'خطای ناشناخته رخ داد');
        }
    }

    // برای آپلود فایل (FormData)
    async uploadFile<T = unknown>(endpoint: string, formData: FormData, timeout: number = 30000): Promise<T> {
        return this.doFetch<T>('POST', endpoint, {body: formData, timeout, isFormData: true});
    }
}

export const apiClient = new ApiClient();
