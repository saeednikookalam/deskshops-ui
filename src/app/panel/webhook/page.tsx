"use client";

import { useEffect, useState, useRef } from "react";
import { webhookService, type WebhookStatus } from "@/services/webhook";
import { Alert } from "@/components/common/Alert";
import { showToast } from "@/lib/toast";
import { ConfirmModal } from "@/components/common/ConfirmModal";

// Code Block Component with Copy Button
function CodeBlock({
  code,
  language = 'json',
  title
}: {
  code: string;
  language?: 'json' | 'bash' | 'http';
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying code:", error);
    }
  };

  // Syntax highlighting helper
  const highlightJSON = (text: string) => {
    return text
      .replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="text-green-400">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-orange-400">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="text-purple-400">$1</span>')
      .replace(/[{}\[\]]/g, '<span class="text-gray-400">$&</span>');
  };

  const highlightBash = (text: string) => {
    return text
      .replace(/(curl|POST|GET|PUT|DELETE)/g, '<span class="text-blue-400">$1</span>')
      .replace(/(-[A-Za-z]|--[a-z-]+)/g, '<span class="text-yellow-400">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>');
  };

  const highlightHTTP = (text: string) => {
    return text
      .replace(/(POST|GET|PUT|DELETE|PATCH)/g, '<span class="text-blue-400">$1</span>')
      .replace(/(Content-Type|X-API-Key|Authorization):/g, '<span class="text-yellow-400">$1</span>:')
      .replace(/application\/json/g, '<span class="text-green-400">application/json</span>');
  };

  const getHighlightedCode = () => {
    switch (language) {
      case 'json':
        return highlightJSON(code);
      case 'bash':
        return highlightBash(code);
      case 'http':
        return highlightHTTP(code);
      default:
        return code;
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-stroke dark:border-dark-3 shadow-sm">
      {title && (
        <div className="bg-gray-2 dark:bg-dark-2 px-4 py-2 border-b border-stroke dark:border-dark-3 flex items-center justify-between">
          <span className="text-xs font-medium text-body-color dark:text-dark-6">{title}</span>
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-dark hover:bg-gray-100 dark:hover:bg-dark-3 text-body-color dark:text-dark-6 transition-colors flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                کپی شد
              </>
            ) : (
              <>
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                کپی
              </>
            )}
          </button>
        </div>
      )}
      <div className="bg-[#1e1e1e] dark:bg-[#0d0d0d] p-4 overflow-x-auto">
        <pre
          dir="ltr"
          className="font-mono text-xs text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
        />
      </div>
    </div>
  );
}

export default function WebhookPage() {
  const [webhookStatus, setWebhookStatus] = useState<WebhookStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'guide' | 'errors'>('overview');
  const initialLoadDone = useRef(false);

  // ساختن URL کامل API Route
  const getFullApiRoute = () => {
    if (!webhookStatus?.apiRoute) return null;

    // آدرس ثابت webhook
    const baseUrl = 'https://api.deskshops.ir/plugins/webhook';

    // اگر apiRoute شامل /webhook/ هست، فقط url_hash رو استخراج کن
    const urlHash = webhookStatus.apiRoute.includes('/webhook/')
      ? webhookStatus.apiRoute.split('/webhook/')[1]
      : webhookStatus.apiRoute;

    return `${baseUrl}/${urlHash}`;
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
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      checkWebhookStatus();
    }
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
        showToast.success("Webhook مجدداً فعال شد");
      } else {
        showToast.error(response.message || "خطا در فعال‌سازی webhook");
      }
    } catch (error) {
      console.error("Error activating webhook:", error);
      showToast.error("خطا در فعال‌سازی webhook");
    }
  };

  const handleConfirmDeactivate = async () => {
    setShowConfirmModal(false);

    try {
      const response = await webhookService.deactivateWebhook();
      if (response.success) {
        setWebhookStatus({ ...webhookStatus!, isActive: false });
        showToast.success("Webhook به صورت موقت غیرفعال شد");
      } else {
        showToast.error(response.message || "خطا در غیرفعال‌سازی webhook");
      }
    } catch (error) {
      console.error("Error deactivating webhook:", error);
      showToast.error("خطا در غیرفعال‌سازی webhook");
    }
  };

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      showToast.success(`${fieldName} کپی شد`);

      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      showToast.error("خطا در کپی کردن");
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
                با فعال‌سازی Webhook می‌توانید محصولات فروشگاه خود را از طریق API به صورت خودکار به‌روزرسانی کنید.
                این قابلیت به شما امکان می‌دهد تا یکپارچگی بهتری با سیستم‌های خارجی داشته باشید.
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
        message="با غیرفعال کردن Webhook، تمام درخواست‌های ارسالی به این آدرس با خطا مواجه خواهند شد. آیا مطمئن هستید؟"
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

      <div className="space-y-6">
        {/* Status Card */}
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

        {/* Tabs */}
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke dark:border-dark-3">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white'
                }`}
              >
                اطلاعات اتصال
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'guide'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white'
                }`}
              >
                راهنمای استفاده
              </button>
              <button
                onClick={() => setActiveTab('errors')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'errors'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white'
                }`}
              >
                خطاها و رفع مشکل
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    آدرس API
                  </label>
                  <div className="flex gap-2">
                    <div dir="ltr" className="flex-1 rounded-lg border border-stroke bg-gray-2 px-4 py-3 font-mono text-sm text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white break-all">
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
                    کلید محرمانه API (X-API-Key)
                  </label>
                  <div className="flex gap-2">
                    <div dir="ltr" className="flex-1 rounded-lg border border-stroke bg-gray-2 px-4 py-3 font-mono text-sm text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
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

                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 dark:border-yellow-500/30 dark:bg-yellow-500/10">
                  <div className="flex gap-3">
                    <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-sm text-yellow-600 dark:text-yellow-500">
                      <p className="font-medium mb-1">نکات امنیتی:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>کلید API خود را در معرض دید عموم قرار ندهید</li>
                        <li>از HTTPS برای ارسال درخواست‌ها استفاده کنید</li>
                        <li>در صورت افشای کلید، webhook را غیرفعال و مجدداً فعال کنید</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guide Tab */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
                    نحوه ارسال درخواست
                  </h3>
                  <div className="space-y-5">
                    {/* HTTP Request Headers */}
                    <div>
                      <p className="text-sm text-body-color dark:text-dark-6 mb-3">
                        برای ارسال محصولات به فروشگاه، باید یک درخواست POST به آدرس API ارسال کنید:
                      </p>
                      <CodeBlock
                        title="HTTP Request"
                        language="http"
                        code={`POST ${getFullApiRoute() || 'YOUR_WEBHOOK_URL'}
Content-Type: application/json
X-API-Key: ${webhookStatus.apiSecretKey || 'YOUR_API_KEY'}`}
                      />
                    </div>

                    {/* JSON Structure */}
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white mb-3">
                        ساختار JSON درخواست:
                      </p>
                      <CodeBlock
                        title="Request Body (JSON)"
                        language="json"
                        code={`{
  "event_type": "product",
  "shop_id": 1,
  "products": [
    {
      "shop_product_id": "prod_001",
      "sku": "SKU-12345",
      "title": "نام محصول",
      "price": "1500000",
      "primary_price": "1800000",
      "stock": "10",
      "status": "active",
      "description": "توضیحات محصول"
    }
  ]
}`}
                      />
                    </div>

                    {/* Fields Table */}
                    <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                      <div className="bg-gray-2 dark:bg-dark-2 px-4 py-2 border-b border-stroke dark:border-dark-3">
                        <p className="text-sm font-medium text-dark dark:text-white">فیلدهای الزامی</p>
                      </div>
                      <div className="p-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <th className="text-right py-2 text-dark dark:text-white">فیلد</th>
                              <th className="text-right py-2 text-dark dark:text-white">نوع</th>
                              <th className="text-right py-2 text-dark dark:text-white">توضیحات</th>
                            </tr>
                          </thead>
                          <tbody className="text-body-color dark:text-dark-6">
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">event_type</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">فعلاً فقط &#34;product&#34;</td>
                            </tr>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">shop_id</td>
                              <td className="py-2 text-right">integer</td>
                              <td className="py-2 text-right">شناسه فروشگاه شما</td>
                            </tr>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">shop_product_id</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">شناسه یکتا محصول در سیستم شما</td>
                            </tr>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">sku</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">کد محصول</td>
                            </tr>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">title</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">عنوان محصول</td>
                            </tr>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">price</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">قیمت فروش (تومان)</td>
                            </tr>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">primary_price</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">قیمت قبل از تخفیف (اختیاری)</td>
                            </tr>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">stock</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">موجودی انبار</td>
                            </tr>
                            <tr className="border-b border-stroke dark:border-dark-3">
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">status</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">&quot;active&quot; یا &quot;inactive&quot;</td>
                            </tr>
                            <tr>
                              <td dir="ltr" className="py-2 font-mono text-primary text-right">description</td>
                              <td className="py-2 text-right">string</td>
                              <td className="py-2 text-right">توضیحات محصول</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Success Response */}
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white mb-3">
                        پاسخ موفق (200):
                      </p>
                      <CodeBlock
                        title="✅ Success Response"
                        language="json"
                        code={`{
  "status": 200,
  "message": "3 products queued for processing",
  "data": {
    "valid_count": 3,
    "invalid_count": 0
  }
}`}
                      />
                    </div>

                    {/* Partial Success Response */}
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white mb-3">
                        پاسخ نیمه‌موفق (207):
                      </p>
                      <CodeBlock
                        title="⚠️ Partial Success Response"
                        language="json"
                        code={`{
  "status": 207,
  "message": "2 products queued for processing",
  "data": {
    "valid_count": 2,
    "invalid_count": 1,
    "invalid_products": [
      {
        "index": 2,
        "shop_product_id": "prod_003",
        "sku": "SKU-003",
        "error": "Missing required field: title"
      }
    ]
  }
}`}
                      />
                    </div>

                    {/* cURL Example */}
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white mb-3">
                        مثال با cURL:
                      </p>
                      <CodeBlock
                        title="💻 cURL Example"
                        language="bash"
                        code={`curl -X POST "${getFullApiRoute() || 'YOUR_WEBHOOK_URL'}" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${webhookStatus.apiSecretKey || 'YOUR_API_KEY'}" \\
  -d '{
    "event_type": "product",
    "shop_id": 1,
    "products": [
      {
        "shop_product_id": "prod_001",
        "sku": "SKU-12345",
        "title": "محصول تستی",
        "price": "1500000",
        "primary_price": "",
        "stock": "10",
        "status": "active",
        "description": "این یک محصول تستی است"
      }
    ]
  }'`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Errors Tab */}
            {activeTab === 'errors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
                    خطاهای رایج و نحوه رفع آن‌ها
                  </h3>
                  <div className="space-y-4">
                    {/* Error 401 */}
                    <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                      <div className="bg-red-50 dark:bg-red-900/10 px-4 py-3 border-b border-stroke dark:border-dark-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-red-600 dark:text-red-500">401</span>
                          <span className="text-sm font-medium text-dark dark:text-white">Unauthorized</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">پیام خطا:</strong> &quot;Invalid API key&quot;
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">دلیل:</strong> کلید API اشتباه یا ارسال نشده است
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">راه حل:</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm text-body-color dark:text-dark-6 mr-4">
                          <li>مطمئن شوید هدر X-API-Key را ارسال کرده‌اید</li>
                          <li>کلید API را از بالای همین صفحه کپی کنید</li>
                          <li>فاصله اضافی قبل یا بعد از کلید وجود نداشته باشد</li>
                        </ul>
                      </div>
                    </div>

                    {/* Error 403 - No Subscription */}
                    <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                      <div className="bg-orange-50 dark:bg-orange-900/10 px-4 py-3 border-b border-stroke dark:border-dark-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-500">403</span>
                          <span className="text-sm font-medium text-dark dark:text-white">Forbidden - Subscription</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">پیام خطا:</strong> &quot;No active subscription for webhook plugin&quot;
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">دلیل:</strong> اشتراک فعالی برای پلاگین webhook ندارید
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">راه حل:</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm text-body-color dark:text-dark-6 mr-4">
                          <li>به بخش پلاگین‌ها بروید و اشتراک webhook را خریداری کنید</li>
                          <li>اگر اشتراک دارید، منقضی نشده باشد</li>
                        </ul>
                      </div>
                    </div>

                    {/* Error 403 - Shop */}
                    <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                      <div className="bg-orange-50 dark:bg-orange-900/10 px-4 py-3 border-b border-stroke dark:border-dark-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-500">403</span>
                          <span className="text-sm font-medium text-dark dark:text-white">Forbidden - Shop Access</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">پیام خطا:</strong> &quot;Shop with id X not found or does not belong to user&quot;
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">دلیل:</strong> shop_id اشتباه است یا به شما تعلق ندارد
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">راه حل:</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm text-body-color dark:text-dark-6 mr-4">
                          <li>shop_id صحیح از بخش فروشگاه‌های خود دریافت کنید</li>
                          <li>مطمئن شوید فروشگاه در پنل شما ثبت شده است</li>
                        </ul>
                      </div>
                    </div>

                    {/* Error 403 - Webhook Inactive */}
                    <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                      <div className="bg-orange-50 dark:bg-orange-900/10 px-4 py-3 border-b border-stroke dark:border-dark-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-500">403</span>
                          <span className="text-sm font-medium text-dark dark:text-white">Forbidden - Webhook Inactive</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">پیام خطا:</strong> &quot;Webhook is not active&quot;
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">دلیل:</strong> webhook به صورت موقت غیرفعال شده است
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">راه حل:</strong> از بالای همین صفحه webhook را مجدداً فعال کنید
                        </p>
                      </div>
                    </div>

                    {/* Error 400 - Validation */}
                    <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                      <div className="bg-yellow-50 dark:bg-yellow-900/10 px-4 py-3 border-b border-stroke dark:border-dark-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-yellow-600 dark:text-yellow-500">400</span>
                          <span className="text-sm font-medium text-dark dark:text-white">Bad Request - Validation</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">پیام خطا:</strong> &quot;All products failed validation&quot;
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">دلیل:</strong> همه محصولات دارای خطای اعتبارسنجی هستند
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">راه حل:</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm text-body-color dark:text-dark-6 mr-4">
                          <li>بررسی کنید تمام فیلدهای الزامی ارسال شده باشند</li>
                          <li>نوع داده‌ها صحیح باشد (price, stock به صورت string)</li>
                          <li>status فقط &quot;active&quot; یا &quot;inactive&quot; باشد</li>
                          <li>shop_product_id یکتا و تکراری نباشد</li>
                        </ul>
                      </div>
                    </div>

                    {/* Error 400 - Event Type */}
                    <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                      <div className="bg-yellow-50 dark:bg-yellow-900/10 px-4 py-3 border-b border-stroke dark:border-dark-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-yellow-600 dark:text-yellow-500">400</span>
                          <span className="text-sm font-medium text-dark dark:text-white">Bad Request - Event Type</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">پیام خطا:</strong> &quot;Unsupported event_type&quot;
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">دلیل:</strong> event_type پشتیبانی نمی‌شود
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">راه حل:</strong> فعلاً فقط از event_type: &quot;product&quot; استفاده کنید
                        </p>
                      </div>
                    </div>

                    {/* Error 500 */}
                    <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                      <div className="bg-red-50 dark:bg-red-900/10 px-4 py-3 border-b border-stroke dark:border-dark-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-red-600 dark:text-red-500">500</span>
                          <span className="text-sm font-medium text-dark dark:text-white">Internal Server Error</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">پیام خطا:</strong> &quot;Failed to process event&quot;
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">دلیل:</strong> مشکل در سمت سرور
                        </p>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          <strong className="text-dark dark:text-white">راه حل:</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm text-body-color dark:text-dark-6 mr-4">
                          <li>چند دقیقه صبر کنید و دوباره تلاش کنید</li>
                          <li>اگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
                  <div className="flex gap-3">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-600 dark:text-blue-500">
                      <p className="font-medium mb-1">نکات عیب‌یابی:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>از ابزارهایی مثل Postman برای تست استفاده کنید</li>
                        <li>پاسخ سرور را کامل بخوانید، معمولاً دلیل خطا در پیام مشخص است</li>
                        <li>لاگ درخواست‌های خود را نگه دارید</li>
                        <li>status code 207 یعنی بعضی محصولات موفق و بعضی ناموفق بودند</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
