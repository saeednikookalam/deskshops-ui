"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { mirrorService, Shop } from "@/services/mirror";
import { showToast } from "@/lib/toast";

// Shop status types
// 1 = غیر متصل (not connected)
// 2 = مقصد (destination)
// 3 = مبدا (source)

type ShopStatus = 1 | 2 | 3;

export default function MirrorPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const pageRef = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadShops = useCallback(async (pageNum: number, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await mirrorService.getShops();

      if (response) {
        if (append) {
          setShops((prev) => [...prev, ...response]);
        } else {
          setShops(response);
        }
        // Assuming API might support pagination in future
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading shops:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در بارگذاری فروشگاه‌ها";
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load shops on mount
  useEffect(() => {
    loadShops(1, false);
  }, [loadShops]);

  // Infinite scroll implementation (for future pagination support)
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          pageRef.current += 1;
          loadShops(pageRef.current, true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadShops]);

  const getStatusLabel = (status: ShopStatus): string => {
    switch (status) {
      case 1:
        return "غیر متصل";
      case 2:
        return "مقصد";
      case 3:
        return "مبدا";
      default:
        return "نامشخص";
    }
  };

  const getStatusColor = (status: ShopStatus): string => {
    switch (status) {
      case 1:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case 2:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case 3:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSetAsSource = async (shopId: number) => {
    try {
      setActionLoading(shopId);
      const response = await mirrorService.setAsSource(shopId);

      if (response.status >= 200 && response.status < 300) {
        showToast.success(response.message);
        // Refresh shops list
        loadShops(1, false);
      } else {
        showToast.error(response.message || "خطا در تنظیم فروشگاه به عنوان مبدا");
      }
    } catch (error) {
      console.error("Error setting shop as source:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در تنظیم فروشگاه به عنوان مبدا";
      showToast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConnectToSource = async (shopId: number) => {
    try {
      setActionLoading(shopId);
      const response = await mirrorService.connectToSource(shopId);

      if (response.status >= 200 && response.status < 300) {
        showToast.success(response.message);
        // Refresh shops list
        loadShops(1, false);
      } else {
        showToast.error(response.message || "خطا در اتصال به مبدا");
      }
    } catch (error) {
      console.error("Error connecting to source:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در اتصال به مبدا";
      showToast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisconnectFromSource = async (shopId: number) => {
    try {
      setActionLoading(shopId);
      const response = await mirrorService.disconnectFromSource(shopId);

      if (response.status >= 200 && response.status < 300) {
        showToast.success(response.message);
        // Refresh shops list
        loadShops(1, false);
      } else {
        showToast.error(response.message || "خطا در قطع اتصال");
      }
    } catch (error) {
      console.error("Error disconnecting from source:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در قطع اتصال";
      showToast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const renderActionButtons = (shop: Shop) => {
    const isLoading = actionLoading === shop.id;

    // Type 1: Not connected - has "Set as Source" and "Connect to Source" buttons
    if (shop.status === 1) {
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleSetAsSource(shop.id)}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
            تنظیم به عنوان مبدا
          </button>
          <button
            onClick={() => handleConnectToSource(shop.id)}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary bg-transparent px-3 py-2 text-xs font-medium text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></span>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            )}
            اتصال به مبدا
          </button>
        </div>
      );
    }

    // Type 2: Destination - has "Set as Source" and "Disconnect" buttons
    if (shop.status === 2) {
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleSetAsSource(shop.id)}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
            تنظیم به عنوان مبدا
          </button>
          <button
            onClick={() => handleDisconnectFromSource(shop.id)}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500 bg-transparent px-3 py-2 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-red-500 border-t-transparent"></span>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            قطع اتصال
          </button>
        </div>
      );
    }

    // Type 3: Source - no buttons
    return null;
  };

  if (loading && shops.length === 0) {
    return (
      <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            آینه
          </h2>
          <p className="mt-2 text-sm text-body-color dark:text-dark-6">
            مدیریت فروشگاه‌ها و تنظیمات آینه
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
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          آینه
        </h2>
        <p className="mt-2 text-sm text-body-color dark:text-dark-6">
          مدیریت فروشگاه‌ها و تنظیمات آینه
        </p>
      </div>

      {shops.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-2">
            <svg
              className="h-10 w-10 text-body-color dark:text-dark-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
            هیچ فروشگاهی یافت نشد
          </h3>
          <p className="text-center text-base text-body-color dark:text-dark-6">
            در حال حاضر فروشگاهی برای نمایش وجود ندارد.
          </p>
        </div>
      ) : (
        <>
          {/* Shops Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="rounded-lg border border-stroke bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-dark-3 dark:bg-dark-2"
              >
                {/* Shop Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-dark dark:text-white line-clamp-1">
                      {shop.title}
                    </h3>
                    <p className="mt-1 text-xs text-body-color dark:text-dark-6">
                      ID: {shop.id}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
                      shop.status as ShopStatus
                    )}`}
                  >
                    {getStatusLabel(shop.status as ShopStatus)}
                  </span>
                </div>

                {/* Shop Info */}
                <div className="mb-4 space-y-2 text-sm text-body-color dark:text-dark-6">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>
                      {shop.type === 1 ? "باسلام" : shop.type === 2 ? "دیجی‌کالا" : "ترب"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(shop.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto">
                  {renderActionButtons(shop)}
                </div>
              </div>
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loadingRef} className="mt-6 py-4">
              {loadingMore && (
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></span>
                  <span className="text-body-color dark:text-dark-6">در حال بارگذاری...</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
