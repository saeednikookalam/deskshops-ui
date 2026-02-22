"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { shopMirrorService, type Shop, type ShopMirrorConfig, type ShopMirrorStatus } from "@/services/shop-mirror";
import { showToast } from "@/lib/toast";
import { Alert } from "@/components/common/Alert";

export default function MirrorPage() {
  // Data states
  const [config, setConfig] = useState<ShopMirrorConfig | null>(null);
  const [availableShops, setAvailableShops] = useState<Shop[]>([]);
  const [configStatus, setConfigStatus] = useState<ShopMirrorStatus | null>(null);
  const [pendingFailuresCount, setPendingFailuresCount] = useState<number>(0);

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

  // Selection states
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<number[]>([]);

  const initialLoadDone = useRef(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load config, available shops, and failure count in parallel
      const [configData, shopsData, failuresData] = await Promise.all([
        shopMirrorService.getConfig(),
        shopMirrorService.getAvailableShops(),
        shopMirrorService.getFailures(1, 1) // Just get count, not actual data
      ]);

      setConfig(configData);
      setAvailableShops(shopsData);
      setPendingFailuresCount(failuresData?.total || 0);

      // Calculate config status
      const status = shopMirrorService.getConfigStatus(configData);
      setConfigStatus(status);

      // Initialize selections from config
      if (configData) {
        setSelectedSource(configData.source_shop_id);
        setSelectedTargets(configData.targets?.map(t => t.target_shop_id) || []);
      }

      // Show warning if not properly configured
      if (!status.isConfigured) {
        const message = shopMirrorService.getValidationMessage(status);
        if (message) {
          setAlert({ type: "warning", message });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در بارگذاری اطلاعات";
      showToast.error(errorMessage);
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    loadData();
  }, [loadData]);

  const handleSaveConfig = async () => {
    if (!selectedSource) {
      showToast.error("لطفاً یک فروشگاه مبدا انتخاب کنید");
      return;
    }

    if (selectedTargets.length === 0) {
      showToast.error("لطفاً حداقل یک فروشگاه مقصد انتخاب کنید");
      return;
    }

    // Validate source is not in targets
    if (selectedTargets.includes(selectedSource)) {
      showToast.error("فروشگاه مبدا نمی‌تواند در مقصدها باشد");
      return;
    }

    try {
      setSaving(true);

      await shopMirrorService.updateConfig({
        source_shop_id: selectedSource,
        target_shop_ids: selectedTargets,
        is_active: true
      });

      showToast.success("تنظیمات با موفقیت ذخیره شد");
      setShowConfigModal(false);
      setAlert(null);

      // Reload data
      await loadData();
    } catch (error) {
      console.error("Error saving config:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در ذخیره تنظیمات";
      showToast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTarget = (shopId: number) => {
    setSelectedTargets(prev => {
      if (prev.includes(shopId)) {
        return prev.filter(id => id !== shopId);
      }
      return [...prev, shopId];
    });
  };

  const getShopById = (id: number) => availableShops.find(s => s.id === id);

  const getSourceShopName = () => {
    if (!configStatus?.sourceShopId) return "تنظیم نشده";
    const shop = getShopById(configStatus.sourceShopId);
    return shop?.title || `فروشگاه ${configStatus.sourceShopId}`;
  };

  const getTargetShopNames = () => {
    if (!configStatus?.targetShopIds.length) return ["تنظیم نشده"];
    return configStatus.targetShopIds.map(id => {
      const shop = getShopById(id);
      return shop?.title || `فروشگاه ${id}`;
    });
  };

  // Check if plugin is disabled (no subscription or not configured)
  const isDisabled = !configStatus?.isConfigured;

  if (loading) {
    return (
      <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            آینه فروشگاه
          </h2>
          <p className="mt-2 text-sm text-body-color dark:text-dark-6">
            همگام‌سازی خودکار محصولات بین فروشگاه‌های باسلام
          </p>
        </div>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <p className="text-body-color dark:text-dark-6">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              آینه فروشگاه
            </h2>
            <p className="mt-2 text-sm text-body-color dark:text-dark-6">
              همگام‌سازی خودکار محصولات بین فروشگاه‌های باسلام
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Failures Link with Badge */}
            <Link
              href="/panel/shop_mirror/failures"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-orange-light-6 text-orange hover:bg-orange-light-5 dark:bg-orange/20 dark:text-orange-light transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              خطاها
              {pendingFailuresCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-orange text-white text-xs font-bold">
                  {pendingFailuresCount > 99 ? '+99' : pendingFailuresCount}
                </span>
              )}
            </Link>

            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              configStatus?.isConfigured
                ? "bg-green-light-6 text-green dark:bg-green/20"
                : "bg-red-light-6 text-red dark:bg-red/20"
            }`}>
              {configStatus?.isConfigured ? "فعال" : "غیرفعال"}
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Disabled Warning Banner */}
      {isDisabled && (
        <div className="mb-6 p-4 bg-yellow-light-4 dark:bg-yellow-dark/10 border border-yellow-dark/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-dark" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-yellow-dark mb-1">
                تنظیمات ناقص
              </h3>
              <p className="text-sm text-dark dark:text-white">
                {shopMirrorService.getValidationMessage(configStatus)}
              </p>
              <p className="text-xs text-body-color dark:text-dark-6 mt-2">
                تا تکمیل نشدن تنظیمات، پلاگین غیرفعال است و وب‌هوک‌ها پردازش نمی‌شوند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Summary */}
      <div className="mb-8 p-4 bg-gray-1 dark:bg-dark-2 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            تنظیمات فعلی
          </h3>
          <button
            onClick={() => setShowConfigModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-opacity-90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {config ? "ویرایش تنظیمات" : "تنظیم پلاگین"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Shop */}
          <div className="p-3 bg-white dark:bg-gray-dark rounded-lg border border-stroke dark:border-dark-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${configStatus?.hasSource ? "bg-green" : "bg-gray-3"}`}></div>
              <span className="text-sm text-body-color dark:text-dark-6">فروشگاه مبدا</span>
            </div>
            <p className="font-medium text-dark dark:text-white truncate">
              {getSourceShopName()}
            </p>
          </div>

          {/* Target Shops */}
          <div className="p-3 bg-white dark:bg-gray-dark rounded-lg border border-stroke dark:border-dark-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${configStatus?.hasTargets ? "bg-green" : "bg-gray-3"}`}></div>
              <span className="text-sm text-body-color dark:text-dark-6">فروشگاه‌های مقصد</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {configStatus?.hasTargets ? (
                getTargetShopNames().map((name, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-light-5 dark:bg-blue/20 text-blue text-xs rounded"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-gray-5 dark:text-dark-4 text-sm">تنظیم نشده</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${isDisabled ? "opacity-50 bg-gray-1 dark:bg-dark-2" : "bg-green-light-6 dark:bg-green/10 border-green/20"}`}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium text-dark dark:text-white">همگام‌سازی محصولات</span>
          </div>
          <p className="text-sm text-body-color dark:text-dark-6">
            ایجاد و به‌روزرسانی خودکار محصولات از مبدا به مقصد
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDisabled ? "opacity-50 bg-gray-1 dark:bg-dark-2" : "bg-blue-light-5 dark:bg-blue/10 border-blue/20"}`}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-dark dark:text-white">مدیریت موجودی</span>
          </div>
          <p className="text-sm text-body-color dark:text-dark-6">
            کاهش خودکار موجودی پس از فروش در هر فروشگاه
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDisabled ? "opacity-50 bg-gray-1 dark:bg-dark-2" : "bg-purple-light-5 dark:bg-purple/10 border-purple/20"}`}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-dark dark:text-white">همگام‌سازی لحظه‌ای</span>
          </div>
          <p className="text-sm text-body-color dark:text-dark-6">
            پردازش آنی رویدادها از طریق وب‌هوک
          </p>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-dark rounded-lg shadow-xl max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-stroke dark:border-dark-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                تنظیم آینه فروشگاه
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-2 text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-6">
              {/* Info Box */}
              <div className="p-3 bg-blue-light-5 dark:bg-blue/10 border border-blue/20 rounded-lg">
                <p className="text-sm text-blue dark:text-blue-light">
                  <span className="font-medium">راهنما:</span> یک فروشگاه را به عنوان مبدا (منبع اصلی) و حداقل یک فروشگاه را به عنوان مقصد انتخاب کنید. محصولات از مبدا به مقصدها کپی می‌شوند.
                </p>
              </div>

              {/* Source Selection */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  فروشگاه مبدا (منبع)
                </label>
                <select
                  value={selectedSource || ""}
                  onChange={(e) => setSelectedSource(Number(e.target.value) || null)}
                  className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  <option value="">انتخاب کنید...</option>
                  {availableShops.map(shop => (
                    <option key={shop.id} value={shop.id}>
                      {shop.title} (ID: {shop.id})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-body-color dark:text-dark-6">
                  تمام تغییرات محصولات در این فروشگاه به مقصدها منتقل می‌شود
                </p>
              </div>

              {/* Targets Selection */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  فروشگاه‌های مقصد ({selectedTargets.length} انتخاب شده)
                </label>
                <div className="border border-stroke dark:border-dark-3 rounded-lg p-3 max-h-60 overflow-auto">
                  {availableShops.length === 0 ? (
                    <p className="text-center text-body-color dark:text-dark-6 py-4">
                      فروشگاهی یافت نشد
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {availableShops.map(shop => {
                        const isSelected = selectedTargets.includes(shop.id);
                        const isSource = selectedSource === shop.id;

                        return (
                          <label
                            key={shop.id}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                              isSource
                                ? "opacity-50 cursor-not-allowed bg-gray-1 dark:bg-dark-2"
                                : isSelected
                                  ? "bg-blue-light-5 dark:bg-blue/10"
                                  : "hover:bg-gray-1 dark:hover:bg-dark-2"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isSource}
                              onChange={() => handleToggleTarget(shop.id)}
                              className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-dark dark:text-white">
                                {shop.title}
                              </p>
                              <p className="text-xs text-body-color dark:text-dark-6">
                                ID: {shop.id}
                              </p>
                            </div>
                            {isSource && (
                              <span className="text-xs text-yellow-dark bg-yellow-light-4 dark:bg-yellow-dark/20 px-2 py-1 rounded">
                                مبدا
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                {selectedSource && (
                  <p className="mt-1 text-xs text-body-color dark:text-dark-6">
                    فروشگاه انتخاب شده به عنوان مبدا، نمی‌تواند مقصد نیز باشد
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-stroke dark:border-dark-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-lg text-dark dark:text-white hover:bg-gray-1 dark:hover:bg-dark-2 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={saving || !selectedSource || selectedTargets.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ذخیره تنظیمات
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
