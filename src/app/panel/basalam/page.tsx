"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { basalamService, type BasalamConnectionStatus } from "@/services/basalam";
import { Alert } from "@/components/basalam/Alert";
import { SettingToggle } from "@/components/basalam/SettingToggle";
import { Toast } from "@/components/basalam/Toast";
import { apiClient } from "@/lib/api-client";

export default function BasalamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connectionStatus, setConnectionStatus] = useState<BasalamConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; message: string }[]>([]);

  // Settings state
  interface Setting {
    setting_id: number;
    title: string;
    description: string;
    user_setting_id: number | null;
    status: boolean;
    updated_at: string | null;
  }
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    // Check for redirect params from backend
    const status = searchParams.get('status');
    const message = searchParams.get('message');
    const state = searchParams.get('state');

    if (status) {
      // Verify state for CSRF protection
      const stateVerification = state ? basalamService.verifyState(state) : { valid: false };

      if (state && !stateVerification.valid) {
        setAlert({
          type: 'error',
          message: 'خطای امنیتی: درخواست نامعتبر است. لطفاً دوباره تلاش کنید.'
        });
      } else if (status === 'success') {
        setAlert({
          type: 'success',
          message: message || 'فروشگاه شما با موفقیت متصل شد!'
        });
      } else if (status === 'error') {
        setAlert({
          type: 'error',
          message: message || 'خطا در اتصال به باسلام. لطفاً دوباره تلاش کنید.'
        });
      }

      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    checkConnectionStatus();
  }, [searchParams]);


  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      const status = await basalamService.getConnectionStatus();
      setConnectionStatus(status);
    } catch (error) {
      console.error("Error checking connection status:", error);
      setConnectionStatus({ isConnected: false });
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      setLoadingSettings(true);
      const response = await apiClient.get<{ settings: Setting[] }>('/plugins/basalam/settings');
      setSettings(response.settings);
    } catch (error) {
      console.error("Error loading settings:", error);
      addToast("error", "خطا در بارگذاری تنظیمات");
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (connectionStatus?.isConnected) {
      loadSettings();
    }
  }, [connectionStatus?.isConnected]);

  const handleConnect = () => {
    setConnecting(true);
    const authUrl = basalamService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleSettingChange = async (settingId: number, title: string, newStatus: boolean) => {
    // Store previous settings for rollback
    const previousSettings = [...settings];

    // Update UI immediately
    setSettings((prev) =>
      prev.map((s) =>
        s.setting_id === settingId
          ? { ...s, status: newStatus, updated_at: new Date().toISOString() }
          : s
      )
    );

    try {
      await apiClient.put<{ success: boolean; message: string; setting: Setting }>(
        '/plugins/basalam/settings',
        {
          setting_id: settingId,
          status: newStatus,
        }
      );

      addToast("success", `${title} ${newStatus ? "فعال" : "غیرفعال"} شد`);
    } catch (error) {
      // Revert on error
      setSettings(previousSettings);
      addToast("error", `خطا در تغییر ${title}`);
      console.error("Error updating setting:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">در حال بررسی وضعیت اتصال...</p>
        </div>
      </div>
    );
  }

  if (!connectionStatus?.isConnected) {
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
                فروشگاه شما هنوز متصل نیست
              </h2>

              <p className="mb-8 text-base leading-relaxed text-body-color dark:text-dark-6">
                با اتصال فروشگاه باسلام خود، می‌توانید تمامی محصولات، سفارشات و موجودی‌ها را به صورت یکپارچه مدیریت کنید.
                این اتصال به شما امکان می‌دهد تا با استفاده از ابزارهای قدرتمند، فروش خود را افزایش داده و تجربه بهتری برای مشتریان خود فراهم کنید.
              </p>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#00BF6F] px-10 py-3.5 text-center font-medium text-white transition-all hover:bg-[#00a35f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                    در حال انتقال...
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
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    اتصال به باسلام
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
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse">
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
        <div className="rounded-[10px] border border-green/20 bg-green/5 p-4 dark:border-green/30 dark:bg-green/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gray-2 dark:bg-dark-2 overflow-hidden">
                  {connectionStatus.shopIcon ? (
                    <img
                      src={connectionStatus.shopIcon}
                      alt={connectionStatus.shopName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg
                        className="h-6 w-6 text-body-color dark:text-dark-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green dark:border-gray-dark"></span>
              </div>

              <div>
                <h3 className="font-semibold text-dark dark:text-white">
                  {connectionStatus.shopName || "فروشگاه باسلام"}
                </h3>
                <p className="text-sm text-green">فروشگاه متصل است</p>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
            >
              بررسی مجدد
            </button>
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
            تنظیمات همگام‌سازی
          </h2>

          {loadingSettings ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                <p className="text-body-color dark:text-dark-6">در حال بارگذاری تنظیمات...</p>
              </div>
            </div>
          ) : settings.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-body-color dark:text-dark-6">هیچ تنظیماتی یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-1">
              {settings.map((setting) => (
                <SettingToggle
                  key={setting.setting_id}
                  id={`setting-${setting.setting_id}`}
                  label={setting.title}
                  description={setting.description}
                  enabled={setting.status}
                  onChange={(value) => handleSettingChange(setting.setting_id, setting.title, value)}
                  lastUpdated={setting.updated_at || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}