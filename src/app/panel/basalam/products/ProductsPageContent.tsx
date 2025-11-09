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

interface Photo {
  id: number;
  lg: string;
  md: string;
  sm: string;
  xs: string;
  original: string;
}

interface BasalamProduct {
  id: number;
  sku: string | null;
  title: string;
  inventory: number;
  status: number;
  price: number;
  photo: Photo | null;
  images: string[] | null;
  category_id: number | null;
  category_title: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProductsPageContent() {
  const [products, setProducts] = useState<BasalamProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hasSkuFilter, setHasSkuFilter] = useState<string>("all");
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const pageRef = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadProducts = useCallback(async (pageNum: number, append = false, filters?: { status?: string; hasSku?: string }) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams();
      params.append('page', String(pageNum));
      params.append('limit', '20');

      const activeStatus = filters?.status || statusFilter;
      const activeHasSku = filters?.hasSku || hasSkuFilter;

      if (activeStatus !== "all") {
        params.append('status', activeStatus);
      }
      if (activeHasSku !== "all") {
        params.append('has_sku', activeHasSku);
      }

      const response = await apiClient.getWithMeta<BasalamProduct[]>(
        `/plugins/basalam/products?${params.toString()}`
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
  }, [statusFilter, hasSkuFilter]);

  useEffect(() => {
    pageRef.current = 1;
    loadProducts(1, false);
  }, [loadProducts]);

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
      const response = await apiClient.postWithFullResponse('/plugins/basalam/sync', {
        entity_type: 1, // 1 = Products
        filters: null,
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
    return status === 2976 ? "فعال" : "غیرفعال";
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
    pageRef.current = 1;
    setSelectedProducts(new Set());
    loadProducts(1, false, { status: value, hasSku: hasSkuFilter });
  };

  const handleHasSkuFilterChange = (value: string) => {
    setHasSkuFilter(value);
    setPage(1);
    pageRef.current = 1;
    setSelectedProducts(new Set());
    loadProducts(1, false, { status: statusFilter, hasSku: value });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(products.map(p => p.id));
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const isAllSelected = products.length > 0 && selectedProducts.size === products.length;

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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            مدیریت محصولات
          </h2>
          {selectedProducts.size > 0 && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {selectedProducts.size} انتخاب شده
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {selectedProducts.size > 0 && (
            <button
              onClick={() => setSelectedProducts(new Set())}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-dark transition-all hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              لغو انتخاب
            </button>
          )}
          <button
            onClick={handleSyncProducts}
            disabled={syncing}
            className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                در حال ثبت درخواست...
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
                درخواست به‌روزرسانی
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
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

        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            وضعیت SKU
          </label>
          <select
            value={hasSkuFilter}
            onChange={(e) => handleHasSkuFilterChange(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="all">همه</option>
            <option value="true">دارای SKU</option>
            <option value="false">بدون SKU</option>
          </select>
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
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-stroke bg-transparent text-primary focus:ring-2 focus:ring-primary dark:border-dark-3"
                  />
                </TableHead>
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
                  <TableCell className="w-[50px]">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-stroke bg-transparent text-primary focus:ring-2 focus:ring-primary dark:border-dark-3"
                    />
                  </TableCell>
                  <TableCell className="min-w-[80px]">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-2 dark:bg-dark-2">
                      {product.photo?.sm ? (
                        <Image
                          src={product.photo.sm}
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
                      {product.inventory}
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
    </div>
  );
}
