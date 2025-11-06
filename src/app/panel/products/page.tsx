"use client";

import { useState } from "react";

export default function ProductsPage() {
  const [products] = useState<unknown[]>([]);

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
          </p>
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
