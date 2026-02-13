"use client";

import { useState, useEffect } from "react";
import { shopService, type ShopType } from "@/services/shop";
import { showToast } from "@/lib/toast";

interface AddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "select" | "connect" | "processing";

export function AddShopModal({ isOpen, onClose, onSuccess }: AddShopModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [selectedMarketplace, setSelectedMarketplace] = useState<ShopType | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shopTypes, setShopTypes] = useState<ShopType[]>([]);

  // Load shop types when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('[AddShopModal] Modal opened, loading shop types...');
      const loadShopTypes = async () => {
        try {
          console.log('[AddShopModal] Calling shopService.getShopTypes()');
          const types = await shopService.getShopTypes();
          console.log('[AddShopModal] Received shop types:', types);
          setShopTypes(types);
          console.log('[AddShopModal] State updated with', types.length, 'shop types');
        } catch (error) {
          console.error("Error loading shop types:", error);
          const errorMessage = error instanceof Error ? error.message : "خطا در بارگذاری انواع فروشگاه";
          showToast.error(errorMessage);
        }
      };
      loadShopTypes();
    } else {
      console.log('[AddShopModal] Modal closed, clearing shop types');
      setShopTypes([]);
    }
  }, [isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setSelectedMarketplace(null);
      setAuthUrl(null);
    }
  }, [isOpen]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleMarketplaceSelect = async (shopType: ShopType) => {
    // Only active shop types can be connected
    if (!shopType.is_active) {
      showToast.info("این مارکت‌پلیس هنوز فعال نشده است");
      return;
    }

    setSelectedMarketplace(shopType);
    setLoading(true);

    try {
      const result = await shopService.initConnection(shopType.id);

      if (result.success && result.data) {
        if (result.data.status === 'oauth') {
          // OAuth flow - redirect to auth URL
          setAuthUrl(result.data.auth_url || null);
          setStep("connect");
        } else if (result.data.status === 'coming_soon') {
          showToast.info(result.message);
          setSelectedMarketplace(null);
        }
      } else {
        showToast.error(result.message || "خطا در ایجاد لینک اتصال");
        setSelectedMarketplace(null);
      }
    } catch (error) {
      console.error("Error initializing connection:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در ایجاد لینک اتصال";
      showToast.error(errorMessage);
      setSelectedMarketplace(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const handleBack = () => {
    setStep("select");
    setSelectedMarketplace(null);
    setAuthUrl(null);
  };

  if (!isOpen) return null;

  // Only show active shop types as available
  const availableShopTypes = shopTypes.filter(st => st.is_active);
  const unavailableShopTypes = shopTypes.filter(st => !st.is_active);

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark sm:p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-body-color hover:text-dark dark:hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {step === "select" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  انتخاب مارکت‌پلیس
                </h2>
                <p className="mt-2 text-body-color dark:text-dark-6">
                  مارکت‌پلیسی که می‌خواهید فروشگاه خود را به آن متصل کنید، انتخاب کنید
                </p>
              </div>

              {/* Available Shop Types */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-dark dark:text-white">
                  انواع فروشگاهی فعال
                </h3>
                <div className="grid gap-3">
                  {availableShopTypes.map((shopType) => (
                    <button
                      key={shopType.id}
                      onClick={() => handleMarketplaceSelect(shopType)}
                      disabled={loading}
                      className="flex items-center gap-4 rounded-lg border border-stroke bg-white p-4 text-right transition-all hover:border-primary hover:bg-gray dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary dark:hover:bg-dark-3 disabled:opacity-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="font-semibold text-dark dark:text-white">
                          {shopType.title}
                        </h4>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          اتصال با OAuth
                        </p>
                      </div>
                      {loading && selectedMarketplace?.id === shopType.id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent" />
                      ) : (
                        <svg className="h-5 w-5 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coming Soon Shop Types */}
              {unavailableShopTypes.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-body-color dark:text-dark-6">
                    به زودی
                  </h3>
                  <div className="grid gap-3">
                    {unavailableShopTypes.map((shopType) => (
                      <div
                        key={shopType.id}
                        className="flex items-center gap-4 rounded-lg border border-stroke bg-gray-2 p-4 opacity-60 dark:border-dark-3 dark:bg-dark-2"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 dark:bg-dark-3">
                          <svg className="h-6 w-6 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-right">
                          <h4 className="font-semibold text-body-color dark:text-dark-6">
                            {shopType.title}
                          </h4>
                          <p className="text-sm text-body-color dark:text-dark-6">
                            به زودی فعال خواهد شد
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {step === "connect" && selectedMarketplace && (
            <>
              <button
                onClick={handleBack}
                className="mb-4 flex items-center gap-2 text-sm text-body-color hover:text-primary dark:text-dark-6"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                بازگشت
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  اتصال به {selectedMarketplace.title}
                </h2>
                <p className="mt-2 text-body-color dark:text-dark-6">
                  برای اتصال فروشگاه خود به {selectedMarketplace.title}، روی دکمه زیر کلیک کنید و به صفحه مجوزدهی هدایت می‌شوید.
                </p>
              </div>

              <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/10">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-white text-sm">
                      اطلاعیه
                    </h4>
                    <p className="text-sm text-body-color dark:text-dark-6 mt-1">
                      پس از تأیید در {selectedMarketplace.title}، به صورت خودکار به این صفحه بازمی‌گردید و فروشگاه شما اضافه می‌شود.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConnect}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-3.5 text-center font-medium text-white transition-all hover:bg-opacity-90"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                اتصال به {selectedMarketplace.title}
              </button>
            </>
          )}

          {step === "processing" && (
            <div className="py-8 text-center">
              <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
                در حال پردازش
              </h3>
              <p className="text-body-color dark:text-dark-6">
                لطفاً منتظر بمانید...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
