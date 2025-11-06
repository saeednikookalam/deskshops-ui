import toast from 'react-hot-toast';

/**
 * Unified toast notifications for the entire application
 *
 * Usage:
 * ```tsx
 * import { showToast } from '@/lib/toast';
 *
 * // Success message
 * showToast.success('عملیات با موفقیت انجام شد');
 *
 * // Error message
 * showToast.error('خطایی رخ داد');
 *
 * // Loading state
 * const toastId = showToast.loading('در حال بارگذاری...');
 * // Later dismiss it
 * showToast.dismiss(toastId);
 *
 * // Promise-based (automatic handling)
 * showToast.promise(
 *   apiCall(),
 *   {
 *     loading: 'در حال ذخیره...',
 *     success: 'ذخیره شد',
 *     error: 'خطا در ذخیره'
 *   }
 * );
 * ```
 */

export const showToast = {
  /**
   * نمایش پیام موفقیت
   */
  success: (message: string) => {
    return toast.success(message);
  },

  /**
   * نمایش پیام خطا
   */
  error: (message: string) => {
    return toast.error(message);
  },

  /**
   * نمایش پیام هشدار
   */
  warning: (message: string) => {
    return toast(message, {
      icon: '⚠️',
    });
  },

  /**
   * نمایش پیام loading
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * نمایش پیام معمولی
   */
  info: (message: string) => {
    return toast(message);
  },

  /**
   * بستن یک toast خاص
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  /**
   * بستن همه toast ها
   */
  dismissAll: () => {
    toast.dismiss();
  },

  /**
   * Handle کردن Promise با toast
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },

  /**
   * نمایش toast با custom options
   */
  custom: (message: string, options?: Parameters<typeof toast>[1]) => {
    return toast(message, options);
  },
};

// همچنین toast اصلی رو export میکنیم برای استفاده‌های پیشرفته
export { toast };
