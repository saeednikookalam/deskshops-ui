"use client";

import { useEffect, useState } from "react";
import { webhookService, type WebhookStatus } from "@/services/webhook";
import { Alert } from "@/components/common/Alert";
import { Toast } from "@/components/common/Toast";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function WebhookPage() {
  const [webhookStatus, setWebhookStatus] = useState<WebhookStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; message: string }[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ساختن URL کامل API Route
  const getFullApiRoute = () => {
    if (!webhookStatus?.apiRoute) return null;

    // آدرس ثابت webhook
    const baseUrl = 'https://api.desksops.ir/webhook';

    // اگر apiRoute شامل /webhook/ هست، فقط url_hash رو استخراج کن
    const urlHash = webhookStatus.apiRoute.includes('/webhook/')
      ? webhookStatus.apiRoute.split('/webhook/')[1]
      : webhookStatus.apiRoute;

    return `${baseUrl}/${urlHash}`;
  };

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const checkWebhookStatus = async () => {
    try {
      setLoading(true);
      const status = await webhookService.getWebhookStatus();
      setWebhookStatus(status);
    } catch (error) {
      console.error("Error checking webhook status:", error);
      setWebhookStatus({ isActive: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWebhookStatus();
  }, []);

  const handleActivate = async () => {
    setActivating(true);
    try {
      const response = await webhookService.activateWebhook();

      if (response.success) {
        setWebhookStatus({
          isActive: true,
          apiRoute: response.apiRoute,
          apiSecretKey: response.apiSecretKey
        });
        setAlert({
          type: 'success',
          message: 'Webhook با موفقیت فعال شد!'
        });
      } else {
        setAlert({
          type: 'error',
          message: response.message || 'خطا در فعال‌سازی webhook'
        });
      }
    } catch (error) {
      console.error("Error activating webhook:", error);
      setAlert({
        type: 'error',
        message: 'خطا در فعال‌سازی webhook'
      });
    } finally {
      setActivating(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!webhookStatus) return;

    // اگر webhook فعاله، اول تاییدیه بگیر
    if (webhookStatus.isActive) {
      setShowConfirmModal(true);
      return;
    }

    // اگر غیرفعاله، مستقیماً فعالش کن
    try {
      const response = await webhookService.activateWebhook();
      if (response.success) {
        setWebhookStatus({
          isActive: true,
          apiRoute: response.apiRoute || webhookStatus.apiRoute,
          apiSecretKey: response.apiSecretKey || webhookStatus.apiSecretKey
        });
        addToast("success", "Webhook مجدداً فعال شد");
      } else {
        addToast("error", response.message || "خطا در فعال‌سازی webhook");
      }
    } catch (error) {
      console.error("Error activating webhook:", error);
      addToast("error", "خطا در فعال‌سازی webhook");
    }
  };

  const handleConfirmDeactivate = async () => {
    setShowConfirmModal(false);

    try {
      const response = await webhookService.deactivateWebhook();
      if (response.success) {
        setWebhookStatus({ ...webhookStatus!, isActive: false });
        addToast("success", "Webhook به صورت موقت غیرفعال شد");
      } else {
        addToast("error", response.message || "خطا در غیرفعال‌سازی webhook");
      }
    } catch (error) {
      console.error("Error deactivating webhook:", error);
      addToast("error", "خطا در غیرفعال‌سازی webhook");
    }
  };

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      addToast("success", `${fieldName} کپی شد`);

      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      addToast("error", "خطا در کپی کردن");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">در حال بررسی وضعیت...</p>
        </div>
      </div>
    );
  }

  if (!webhookStatus?.isActive && !webhookStatus?.apiRoute) {
    return (
      <div>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-10">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-2">
                  <svg
                    className="h-12 w-12 text-body-color dark:text-dark-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">
                Webhook هنوز فعال نشده است
              </h2>

              <p className="mb-8 text-base leading-relaxed text-body-color dark:text-dark-6">
                با فعال‌سازی Webhook می‌توانید رویدادهای مختلف فروشگاه خود را به صورت خودکار به سیستم‌های خارجی ارسال کنید.
                این قابلیت به شما امکان می‌دهد تا یکپارچگی بهتری با سرویس‌های دیگر داشته باشید و فرآیندهای خود را خودکارسازی کنید.
              </p>

              <button
                onClick={handleActivate}
                disabled={activating}
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-10 py-3.5 text-center font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activating ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                    در حال فعال‌سازی...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    فعال‌سازی Webhook
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Confirm Modal برای غیرفعال کردن */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="غیرفعال‌سازی Webhook"
        message="با غیرفعال کردن Webhook، تمام درخواست‌های ارسالی به این آدرس با خطا مواجه خواهند شد و امکان دارد موجودی‌های شما با سیستم‌های خارجی همگام‌سازی نشوند. آیا مطمئن هستید؟"
        confirmText="بله، غیرفعال کن"
        cancelText="انصراف"
        confirmVariant="outlinePrimary"
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setShowConfirmModal(false)}
      />

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
              index={index}
            />
          ))}
        </div>
      )}

      <div className="space-y-6">
        <div className={`rounded-[10px] border p-4 ${
          webhookStatus.isActive
            ? 'border-green/20 bg-green/5 dark:border-green/30 dark:bg-green/10'
            : 'border-yellow-500/20 bg-yellow-500/5 dark:border-yellow-500/30 dark:bg-yellow-500/10'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-dark-2">
                  <svg
                    className={`h-6 w-6 ${webhookStatus.isActive ? 'text-green' : 'text-yellow-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                  webhookStatus.isActive ? 'bg-green' : 'bg-yellow-500'
                } dark:border-gray-dark`}></span>
              </div>

              <div>
                <h3 className="font-semibold text-dark dark:text-white">
                  Webhook
                </h3>
                <p className={`text-sm ${webhookStatus.isActive ? 'text-green' : 'text-yellow-600 dark:text-yellow-500'}`}>
                  {webhookStatus.isActive ? 'فعال' : 'غیرفعال'}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleStatus}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                webhookStatus.isActive
                  ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-500'
                  : 'bg-green/10 text-green hover:bg-green/20'
              }`}
            >
              {webhookStatus.isActive ? 'غیرفعال کردن موقت' : 'فعال کردن مجدد'}
            </button>
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-8">
          <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
            اطلاعات اتصال
          </h2>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                آدرس API
              </label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border border-stroke bg-gray-2 px-4 py-3 font-mono text-sm text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white break-all">
                  {getFullApiRoute() || 'در حال بارگذاری...'}
                </div>
                <button
                  onClick={() => {
                    const fullRoute = getFullApiRoute();
                    if (fullRoute) handleCopy(fullRoute, 'آدرس API');
                  }}
                  disabled={!getFullApiRoute()}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copiedField === 'آدرس API' ? (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden sm:inline">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">کپی</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                کلید محرمانه API
              </label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border border-stroke bg-gray-2 px-4 py-3 font-mono text-sm text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                  {webhookStatus.apiSecretKey || 'در حال بارگذاری...'}
                </div>
                <button
                  onClick={() => webhookStatus.apiSecretKey && handleCopy(webhookStatus.apiSecretKey, 'کلید محرمانه API')}
                  disabled={!webhookStatus.apiSecretKey}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copiedField === 'کلید محرمانه API' ? (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden sm:inline">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">کپی</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-stroke bg-gray-2 p-6 dark:border-dark-3 dark:bg-dark-2">
            <h3 className="mb-4 text-base font-semibold text-dark dark:text-white">
              راهنمای استفاده
            </h3>
            <div className="space-y-3 text-sm text-body-color dark:text-dark-6">
              <p>
                برای ارسال رویدادها به فروشگاه خود از طریق Webhook، باید درخواست‌های POST خود را به <span className="font-mono text-primary">آدرس API</span> ارسال کنید.
              </p>
              <p>
                در هر درخواست، باید <span className="font-mono text-primary">کلید محرمانه API</span> را در هدر <span className="font-mono">X-API-Key</span> قرار دهید:
              </p>
              <div className="rounded-lg bg-white p-4 font-mono text-xs dark:bg-gray-dark">
                X-API-Key: YOUR_API_SECRET_KEY
              </div>
              <p className="text-yellow-600 dark:text-yellow-500">
                ⚠️ توجه: این اطلاعات محرمانه هستند و نباید با دیگران به اشتراک گذاشته شوند.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
