"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { mixinService, type MixinShop, type MixinConnectionStatus } from "@/services/mixin";
import { Alert } from "@/components/common/Alert";
import { showToast } from "@/lib/toast";

export default function MixinPageContent() {
  const [connectionStatus, setConnectionStatus] = useState<MixinConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const initialLoadDone = useRef(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<MixinShop | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    base_url: "",
    api_token: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [urlError, setUrlError] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const checkConnectionStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await mixinService.getShops();
      setConnectionStatus(status);
    } catch (error) {
      console.error("Error checking connection status:", error);
      setConnectionStatus({ isConnected: false, shops: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoadDone.current) return;

    const loadData = async () => {
      initialLoadDone.current = true;
      await checkConnectionStatus();
    };

    loadData();
  }, [checkConnectionStatus]);

  useEffect(() => {
    const isAnyModalOpen = isAddModalOpen || isEditModalOpen || isDeleteModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAddModalOpen, isEditModalOpen, isDeleteModalOpen]);

  const validateUrl = (url: string): boolean => {
    if (!url) {
      setUrlError("");
      return false;
    }

    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        setUrlError("آدرس باید با http یا https شروع شود");
        return false;
      }
      setUrlError("");
      return true;
    } catch {
      setUrlError("آدرس وارد شده معتبر نیست");
      return false;
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, base_url: url });
    if (url) {
      validateUrl(url);
    } else {
      setUrlError("");
    }
  };

  const handleOpenAddModal = () => {
    setFormData({ title: "", base_url: "", api_token: "" });
    setUrlError("");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (shop: MixinShop) => {
    setSelectedShop(shop);
    setFormData({ title: shop.title, base_url: shop.base_url, api_token: "" });
    setUrlError("");
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (shop: MixinShop) => {
    setSelectedShop(shop);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedShop(null);
    setFormData({ title: "", base_url: "", api_token: "" });
    setUrlError("");
  };

  const handleTestConnection = async () => {
    if (!formData.base_url || !formData.api_token) {
      showToast.error("لطفاً آدرس و توکن API را وارد کنید");
      return;
    }

    if (!validateUrl(formData.base_url)) {
      showToast.error(urlError || "آدرس وارد شده معتبر نیست");
      return;
    }

    try {
      setIsTesting(true);
      const result = await mixinService.testConnection({
        base_url: formData.base_url,
        api_token: formData.api_token,
      });

      if (result.success) {
        showToast.success(result.message);
      } else {
        showToast.error(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در تست اتصال";
      showToast.error(errorMessage);
    } finally {
      setIsTesting(false);
    }
  };

  const handleAddShop = async () => {
    if (!formData.title || !formData.base_url || !formData.api_token) {
      showToast.error("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    if (!validateUrl(formData.base_url)) {
      showToast.error(urlError || "آدرس وارد شده معتبر نیست");
      return;
    }

    try {
      setIsSubmitting(true);

      // First test connection
      const testResult = await mixinService.testConnection({
        base_url: formData.base_url,
        api_token: formData.api_token,
      });

      if (!testResult.success) {
        showToast.error(testResult.message);
        return;
      }

      // Add shop
      await mixinService.addShop(formData);
      showToast.success("با موفقیت اضافه شد");
      handleCloseModal();
      await checkConnectionStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در افزودن";
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateToken = async () => {
    if (!selectedShop || !formData.api_token) {
      showToast.error("لطفاً توکن جدید را وارد کنید");
      return;
    }

    try {
      setIsSubmitting(true);

      // First test connection
      const testResult = await mixinService.testConnection({
        base_url: selectedShop.base_url,
        api_token: formData.api_token,
      });

      if (!testResult.success) {
        showToast.error(testResult.message);
        return;
      }

      // Update token
      await mixinService.updateToken({
        shop_id: selectedShop.id,
        api_token: formData.api_token,
      });
      showToast.success("توکن با موفقیت به‌روزرسانی شد");
      handleCloseModal();
      await checkConnectionStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در به‌روزرسانی توکن";
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShop = async () => {
    if (!selectedShop) return;

    try {
      await mixinService.deleteShop(selectedShop.id);
      showToast.success("با موفقیت حذف شد");
      handleCloseModal();
      await checkConnectionStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در حذف";
      showToast.error(errorMessage);
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

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Empty Card - Always first */}
          <div
            onClick={handleOpenAddModal}
            className="cursor-pointer rounded-[10px] bg-gradient-to-br from-primary/5 to-purple/5 dark:from-primary/10 dark:to-purple/10 p-4 shadow-1 transition-all hover:shadow-lg h-full flex flex-col border-2 border-dashed border-primary/30 dark:border-primary/40 hover:border-primary/60"
          >
            {/* Icon and Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0">
                <div className="text-primary bg-primary/10 dark:bg-primary/20 rounded-full p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-dark dark:text-white">اتصال جدید</h3>
              </div>
              <div className="flex-shrink-0 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                افزودن
              </div>
            </div>

            {/* Description */}
            <div className="mb-3 h-12 flex items-start">
              <p className="text-base text-body-color dark:text-dark-6 leading-relaxed line-clamp-2">
                با افزودن اتصال جدید، می‌توانید Mixin خود را به پنل متصل کنید و به راحتی مدیریت کنید.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mb-3 flex items-center">
              <div className="w-full p-2 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30">
                <div className="flex items-center justify-center text-primary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="font-medium text-sm">کلیک برای اتصال</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center justify-center text-sm text-body-color dark:text-dark-6 h-5">
              <span>اتصال امن و سریع</span>
            </div>
          </div>

          {/* Shop Cards */}
          {connectionStatus?.shops.map((shop) => (
            <div
              key={shop.id}
              className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white break-words">
                    {shop.title}
                  </h3>
                  <p className="text-sm text-body-color dark:text-dark-6 break-all" dir="ltr">
                    {shop.base_url}
                  </p>
                </div>
                <span className="inline-flex h-3 w-3 flex-shrink-0 rounded-full bg-green"></span>
              </div>

              <div className="mb-4 rounded-lg bg-gray-2 p-3 dark:bg-dark-2">
                <p className="text-xs text-body-color dark:text-dark-6 mb-1">توکن API</p>
                <p className="font-mono text-sm text-dark dark:text-white">
                  {mixinService.maskToken(shop.api_token)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(shop)}
                  className="flex-1 rounded-lg border border-stroke py-2 px-4 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
                >
                  ویرایش توکن
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(shop)}
                  className="rounded-lg border border-red bg-red/10 py-2 px-4 text-sm font-medium text-red transition hover:bg-red/20"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Shop Modal */}
      {isAddModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4" onClick={handleCloseModal}>
          <div className="relative w-full max-w-lg rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">افزودن جدید</h3>
            <p className="mb-6 text-sm text-body-color dark:text-dark-6">
              برای دریافت آدرس و توکن، به پنل مدیریت Mixin خود مراجعه کنید و از بخش تنظیمات API، اطلاعات مورد نیاز را کپی کنید.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  عنوان
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="نام دلخواه را وارد کنید"
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  آدرس (Base URL)
                </label>
                <input
                  type="url"
                  value={formData.base_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full rounded-lg border ${urlError ? 'border-red' : 'border-stroke'} bg-transparent py-3 px-5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white`}
                />
                {urlError && (
                  <p className="mt-1 text-sm text-red">{urlError}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  توکن API
                </label>
                <input
                  type="text"
                  value={formData.api_token}
                  onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                  placeholder="توکن API را وارد کنید"
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex-1 rounded-lg border border-stroke py-3 px-5 text-center font-medium text-dark transition hover:bg-gray-2 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
                >
                  {isTesting ? "در حال تست..." : "تست اتصال"}
                </button>
                <button
                  onClick={handleAddShop}
                  disabled={isSubmitting || !!urlError}
                  className="flex-1 rounded-lg bg-primary py-3 px-5 text-center font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "در حال افزودن..." : "افزودن"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Token Modal */}
      {isEditModalOpen && selectedShop && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4" onClick={handleCloseModal}>
          <div className="relative w-full max-w-lg rounded-[10px] bg-white p-8 shadow-2xl dark:bg-gray-dark" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="mb-6 text-xl font-bold text-dark dark:text-white">
              ویرایش توکن - {selectedShop?.title}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  آدرس
                </label>
                <input
                  type="text"
                  value={selectedShop.base_url}
                  disabled
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 px-5 text-body-color dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  توکن API جدید
                </label>
                <input
                  type="text"
                  value={formData.api_token}
                  onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                  placeholder="توکن API جدید را وارد کنید"
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting || !formData.api_token}
                  className="flex-1 rounded-lg border border-stroke py-3 px-5 text-center font-medium text-dark transition hover:bg-gray-2 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
                >
                  {isTesting ? "در حال تست..." : "تست اتصال"}
                </button>
                <button
                  onClick={handleUpdateToken}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-primary py-3 px-5 text-center font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "در حال به‌روزرسانی..." : "به‌روزرسانی توکن"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedShop && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4" onClick={handleCloseModal}>
          <div className="relative w-full max-w-md rounded-[10px] bg-white p-8 shadow-2xl dark:bg-gray-dark" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red/10">
                <svg className="h-8 w-8 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            <h3 className="mb-3 text-center text-xl font-bold text-dark dark:text-white">
              حذف اتصال
            </h3>

            <p className="mb-6 text-center text-body-color dark:text-dark-6">
              آیا از حذف <span className="font-semibold text-dark dark:text-white">{selectedShop?.title}</span> اطمینان دارید؟
              این عملیات قابل بازگشت نیست.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 rounded-lg border border-stroke py-3 px-5 text-center font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                انصراف
              </button>
              <button
                onClick={handleDeleteShop}
                className="flex-1 rounded-lg bg-red py-3 px-5 text-center font-medium text-white transition hover:bg-opacity-90"
              >
                حذف
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
