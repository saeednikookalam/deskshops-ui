"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { showToast } from "@/lib/toast";

export default function ProductsPageContent() {
  const [products] = useState<unknown[]>([]);
  const [syncing, setSyncing] = useState(false);

  const handleSyncProducts = async () => {
    try {
      setSyncing(true);
      const response = await apiClient.postWithFullResponse('/plugins/basalam/sync', {
        entity_type: 1, // 1 = Products
        filters: null,
      });

      // نمایش message از API با رنگ مناسب بر اساس status code
      const message = response.message || "درخواست به‌روزرسانی محصولات با موفقیت ثبت شد";

      if (response.status >= 200 && response.status < 300) {
        showToast.success(message);
      } else if (response.status >= 400 && response.status < 500) {
        showToast.warning(message);
      } else {
        showToast.error(message);
      }
    } catch (error) {
      console.error("Error syncing products:", error);

      // نمایش message از خطای API
      const errorMessage = error instanceof Error ? error.message : "خطا در ثبت درخواست به‌روزرسانی";
      showToast.error(errorMessage);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          مدیریت محصولات
        </h2>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-2">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
            هیچ محصولی یافت نشد
          </h3>
          <p className="mb-6 text-center text-base text-body-color dark:text-dark-6">
            در حال حاضر محصولی برای نمایش وجود ندارد.
            <br />
            در صورتی که بروزرسانی خودکار را از منوی تنظیمات فعال کرده باشید محصولات به صورت خودکار به روز خواهند بود.
          </p>
          <button
            onClick={handleSyncProducts}
            disabled={syncing}
            className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-8 py-3 text-center font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                در حال ثبت درخواست...
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                درخواست به‌روزرسانی
              </>
            )}
          </button>
        </div>
      )}

      {/* Products List - Will be implemented later */}
      {products.length > 0 && (
        <div className="grid gap-4">
          {/* Product items will be rendered here */}
        </div>
      )}
    </div>
  );
}
