import {clearTokens, getToken} from './token-manager';

// const API_BASE_URL = 'https://api.deskshops.ir';
const API_BASE_URL = 'http://127.0.0.1:8000';


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

    private isRedirecting = false;

    private clearTokensAndRedirect() {
        if (this.isRedirecting) return;
        this.isRedirecting = true;

        clearTokens();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    private handleFetchError(): never {
        const offline = typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine;
        const msg = offline
            ? 'به اینترنت متصل نیستید. لطفاً اتصال خود را بررسی کنید.'
            : 'عدم دسترسی به سرور. لطفاً بعداً دوباره تلاش کنید.';
        throw new ApiError(msg);
    }

    private async parseBodySafely(response: Response): Promise<unknown> {
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
            this.clearTokensAndRedirect();
            throw new ApiError('Unauthorized', response.status);
        }

        if (!response.ok) {
            const data = await this.parseBodySafely(response);
            const messageFromObject =
                typeof data === 'object' && data !== null && 'message' in data &&
                typeof (data as { message?: unknown }).message === 'string'
                    ? (data as { message: string }).message
                    : null;
            const messageFromString = typeof data === 'string' ? data : null;
            const msg = messageFromObject || messageFromString || `HTTP error ${response.status}`;
            throw new ApiError(msg, response.status, data);
        }

        // اگر بدنه خالی بود (مثلاً 204)، تلاش برای parse نکن
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type') || '';
        if (response.status === 204 || contentLength === '0' || !contentType.includes('application/json')) {
            // @ts-expect-error - وقتی بدنه JSON نیست، T ممکنه void باشه
            return undefined;
        }

        const jsonResponse = await response.json();

        // اگر response ساختار جدید API داره (با data)، فقط data رو برگردون
        if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
            return jsonResponse.data as T;
        }

        // در غیر اینصورت کل response رو برگردون
        return jsonResponse as T;
    }

    private async doFetch<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        opts?: { body?: unknown; timeout?: number; isFormData?: boolean }
    ): Promise<T> {
        // اگر در حال redirect هستیم، هیچ request دیگه‌ای نزن
        if (this.isRedirecting) {
            throw new ApiError('Redirecting to login...');
        }

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
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === 'TimeoutError') {
                throw new ApiError('درخواست شما منقضی شد. لطفاً دوباره تلاش کنید.');
            }
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                // اگه token داریم، احتمالاً 401 هست (CORS جلوی دیدن status رو گرفته)
                if (getToken()) {
                    this.clearTokensAndRedirect();
                    throw new ApiError('Session expired', 401);
                }

                // اگه token نداریم، مشکل واقعاً سرور یا اینترنته
                this.handleFetchError();
            }
            // اگر ApiError از handleResponse آمده، همان را پاس بده
            if (error instanceof ApiError) throw error;
            // خطای ناشناخته
            if (error instanceof Error && error.message) {
                throw new ApiError(error.message);
            }
            throw new ApiError('خطای ناشناخته رخ داد');
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

    // برای API هایی که نیاز به دسترسی به meta دارند
    async getWithMeta<T = unknown>(endpoint: string): Promise<{ data: T; meta?: Record<string, unknown> }> {
        try {
            const headers = this.getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers,
                cache: 'no-store',
            });

            if (response.status === 401 || response.status === 419) {
                this.clearTokensAndRedirect();
                throw new ApiError('Unauthorized', response.status);
            }

            if (!response.ok) {
                const data = await this.parseBodySafely(response);
                const messageFromObject =
                    typeof data === 'object' && data !== null && 'message' in data &&
                    typeof (data as { message?: unknown }).message === 'string'
                        ? (data as { message: string }).message
                        : null;
                const msg = messageFromObject || `HTTP error ${response.status}`;
                throw new ApiError(msg, response.status, data);
            }

            const jsonResponse = await response.json();

            // برگرداندن data و meta
            if (jsonResponse && typeof jsonResponse === 'object') {
                return {
                    data: jsonResponse.data as T,
                    meta: jsonResponse.meta as Record<string, unknown> | undefined
                };
            }

            return { data: jsonResponse as T };
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError('خطا در ارتباط با سرور');
        }
    }

    // برای ریکوئست‌های احراز هویت (بدون header توکن)
    async authRequest<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
        // اگر در حال redirect هستیم، هیچ request دیگه‌ای نزن
        if (this.isRedirecting) {
            throw new ApiError('Redirecting to login...');
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: body ? JSON.stringify(body) : undefined,
                signal: AbortSignal.timeout(10000),
                cache: 'no-store',
            });

            return this.handleResponse<T>(response);
        } catch (error: unknown) {
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                this.handleFetchError();
            }
            if (error instanceof ApiError) throw error;
            if (error instanceof Error && error.message) {
                throw new ApiError(error.message);
            }
            throw new ApiError('خطای ناشناخته رخ داد');
        }
    }

    // برای آپلود فایل (FormData)
    async uploadFile<T = unknown>(endpoint: string, formData: FormData, timeout: number = 30000): Promise<T> {
        return this.doFetch<T>('POST', endpoint, {body: formData, timeout, isFormData: true});
    }

    // برای دریافت کل response (شامل status, message, data)
    async postWithFullResponse<T = unknown>(endpoint: string, body?: unknown): Promise<{ status: number; message?: string; data?: T }> {
        try {
            const headers = this.getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: body ? JSON.stringify(body) : undefined,
                signal: AbortSignal.timeout(10000),
                cache: 'no-store',
            });

            if (response.status === 401 || response.status === 419) {
                this.clearTokensAndRedirect();
                throw new ApiError('Unauthorized', response.status);
            }

            if (!response.ok) {
                const data = await this.parseBodySafely(response);
                const messageFromObject =
                    typeof data === 'object' && data !== null && 'message' in data &&
                    typeof (data as { message?: unknown }).message === 'string'
                        ? (data as { message: string }).message
                        : null;
                const msg = messageFromObject || `HTTP error ${response.status}`;
                throw new ApiError(msg, response.status, data);
            }

            const jsonResponse = await response.json();

            // برگرداندن کل response (با message)
            if (jsonResponse && typeof jsonResponse === 'object') {
                return {
                    status: jsonResponse.status || response.status,
                    message: jsonResponse.message,
                    data: jsonResponse.data as T
                };
            }

            return { status: response.status, data: jsonResponse as T };
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError('خطا در ارتباط با سرور');
        }
    }
}

export const apiClient = new ApiClient();
