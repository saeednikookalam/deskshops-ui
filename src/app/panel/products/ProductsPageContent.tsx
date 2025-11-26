"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import { showToast } from "@/lib/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Currency } from "@/components/ui/currency";
import { formatWithPersianComma } from "@/lib/number-utils";
import { ExportProductsModal } from "@/components/ui/export-products-modal";

interface Shop {
  id: number;
  title: string;
  logo: string | null;
  type: number;
}

interface Product {
  id: number;
  sku: string | null;
  title: string;
  stock: number;
  status: number;
  price: number;
  image: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const pageRef = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<string>("all");
  const shopFilterRef = useRef<string>("all");

  // Keep refs in sync with state
  statusFilterRef.current = statusFilter;
  shopFilterRef.current = shopFilter;

  const loadProducts = useCallback(async (pageNum: number, append = false, filters?: { status?: string; shop?: string }) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams();
      const limit = 20;
      const offset = (pageNum - 1) * limit;

      params.append('limit', String(limit));
      params.append('offset', String(offset));

      const activeStatus = filters?.status || statusFilterRef.current;
      const activeShop = filters?.shop || shopFilterRef.current;

      if (activeStatus !== "all") {
        // Convert "active"/"inactive" to 1/0
        const statusValue = activeStatus === "active" ? "1" : "0";
        params.append('status', statusValue);
      }
      if (activeShop !== "all") {
        params.append('shop_id', activeShop);
      }

      const response = await apiClient.getWithMeta<Product[]>(
        `/products?${params.toString()}`
      );

      if (response.data) {
        if (append) {
          setProducts((prev) => [...prev, ...response.data]);
        } else {
          setProducts(response.data);
        }
        setHasMore(response.meta?.has_more === true);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      showToast.error("خطا در بارگذاری محصولات");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load shops
  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoadingShops(true);
        const response = await apiClient.get<Shop[]>('/shops/');
        if (response) {
          setShops(response);
        }
      } catch (error) {
        console.error("Error loading shops:", error);
        showToast.error("خطا در بارگذاری فروشگاه‌ها");
      } finally {
        setLoadingShops(false);
      }
    };

    loadShops();
  }, []);

  // Load products on mount and when filters change
  useEffect(() => {
    pageRef.current = 1;
    loadProducts(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, shopFilter]);

  // Infinite scroll implementation
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          pageRef.current += 1;
          loadProducts(pageRef.current, true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore]);

  const handleSyncProducts = async () => {
    try {
      setSyncing(true);

      const syncFilters = shopFilter !== "all" ? { shop_id: Number(shopFilter) } : null;

      const response = await apiClient.postWithFullResponse('/plugins/basalam/sync', {
        entity_type: 1, // 1 = Products
        filters: syncFilters,
      });

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
      const errorMessage = error instanceof Error ? error.message : "خطا در ثبت درخواست به‌روزرسانی";
      showToast.error(errorMessage);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusLabel = (status: number): string => {
    return status === 1 ? "فعال" : "غیرفعال";
  };

  const getShopTypeLabel = (type: number): string => {
    switch (type) {
      case 1:
        return "بسلام";
      case 2:
        return "دیجی‌کالا";
      case 3:
        return "ترب";
      default:
        return "نامشخص";
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleShopFilterChange = (value: string) => {
    setShopFilter(value);
  };

  const handleExportProducts = async (status: string) => {
    try {
      setIsExporting(true);

      // TODO: Implement API call for exporting products
      // For now, just log the status filter
      console.log("Exporting products with status:", status);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      showToast.success("فایل Excel محصولات با موفقیت دانلود شد");
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Error exporting products:", error);
      showToast.error("خطا در دانلود فایل");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          مدیریت محصولات
        </h2>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {/* Filters Section */}
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              فروشگاه
            </label>
            <select
              value={shopFilter}
              onChange={(e) => handleShopFilterChange(e.target.value)}
              disabled={loadingShops}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-dark outline-none transition focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="all">همه فروشگاه‌ها</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.title} - {getShopTypeLabel(shop.type)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              وضعیت محصول
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="all">همه محصولات</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
          <button
            onClick={handleSyncProducts}
            disabled={syncing}
            className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {syncing ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                در حال ثبت...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                به‌روزرسانی
              </>
            )}
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center justify-center gap-2.5 rounded-lg border border-primary bg-transparent px-6 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white whitespace-nowrap"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            خروجی Excel
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-2">
            <svg
              className="h-12 w-12 text-body-color dark:text-dark-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
            برای دریافت محصولات از دکمه «درخواست به‌روزرسانی» استفاده کنید.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[80px]">عکس</TableHead>
                <TableHead className="min-w-[120px]">SKU</TableHead>
                <TableHead className="min-w-[200px]">عنوان</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>موجودی</TableHead>
                <TableHead>وضعیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="min-w-[80px]">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-2 dark:bg-dark-2">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={64}
                          height={64}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg
                            className="h-8 w-8 text-body-color dark:text-dark-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <span className="font-mono text-sm text-dark dark:text-white">
                      {product.sku || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <h5 className="font-medium text-dark dark:text-white">
                      {product.title}
                    </h5>
                  </TableCell>
                  <TableCell>
                    <Currency
                      value={product.price}
                      className="font-medium text-dark dark:text-white"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-dark dark:text-white">
                      {formatWithPersianComma(product.stock)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-dark dark:text-white">
                      {getStatusLabel(product.status)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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

      {/* Export Modal */}
      <ExportProductsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportProducts}
        isExporting={isExporting}
      />
    </div>
  );
}
