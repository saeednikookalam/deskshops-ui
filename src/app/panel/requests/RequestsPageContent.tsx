"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import { showToast } from "@/lib/toast";
import { getToken } from "@/lib/token-manager";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SyncEntity {
  id: number;
  entity_type: number; // 1=Products, 2=Orders, 3=Export Products
  total_pages: number | null;
  processed_page: number | null;
  status: number; // 1=Pending, 2=Processing, 3=Completed, 4=Cancelled
  filters: Record<string, unknown> | null;
  processed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const STATUS_LABELS: Record<number, string> = {
  1: "در انتظار",
  2: "در حال پردازش",
  3: "تکمیل شده",
  4: "لغو شده",
};

const STATUS_COLORS: Record<number, string> = {
  1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  2: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  3: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  4: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const ENTITY_TYPE_LABELS: Record<number, string> = {
  1: "محصولات",
  2: "سفارشات",
  3: "خروجی محصولات",
};

export default function RequestsPageContent() {
  const [requests, setRequests] = useState<SyncEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const initialLoadDone = useRef(false);

  const loadRequests = useCallback(async (pageNum: number, append = false, isRefresh = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await apiClient.getWithMeta<SyncEntity[]>(
        `/plugins/basalam/sync?page=${pageNum}&limit=20`
      );

      if (response.data) {
        if (append) {
          setRequests((prev) => [...prev, ...response.data]);
        } else {
          setRequests(response.data);
        }
        setHasMore(response.meta?.has_more === true);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      if (!isRefresh) {
        showToast.error("خطا در بارگذاری درخواست‌ها");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  // Load initial data once
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadRequests(1, false, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh هر 10 ثانیه
  useEffect(() => {
    const interval = setInterval(() => {
      if (initialLoadDone.current) {
        loadRequests(1, false, true);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadRequests(nextPage, true);
  };

  const handleCancel = async (requestId: number) => {
    try {
      setCancellingId(requestId);
      await apiClient.put(`/plugins/basalam/sync/${requestId}/cancel`);

      showToast.success("درخواست با موفقیت لغو شد");

      // بارگذاری مجدد لیست - refresh فقط صفحه اول
      loadRequests(1, false, true);
    } catch (error) {
      console.error("Error cancelling request:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در لغو درخواست";
      showToast.error(errorMessage);
    } finally {
      setCancellingId(null);
    }
  };

  const getProgress = (request: SyncEntity): number => {
    if (!request.total_pages || request.total_pages === 0) return 0;
    return Math.round(((request.processed_page || 0) / request.total_pages) * 100);
  };

  const canCancel = (status: number): boolean => {
    return status === 1 || status === 2; // Pending or Processing
  };

  const handleDownload = async (requestId: number) => {
    try {
      setDownloadingId(requestId);

      // دانلود فایل از API
      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/plugins/basalam/exports/${requestId}/download`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        showToast.error('خطا در دریافت فایل از سرور');
        return;
      }

      // دریافت فایل به صورت blob
      const blob = await response.blob();

      // ساخت URL موقت برای دانلود
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-export-${requestId}.csv`;
      document.body.appendChild(a);
      a.click();

      // پاکسازی
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast.success("فایل با موفقیت دانلود شد");
    } catch (error) {
      console.error("Error downloading file:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در دانلود فایل";
      showToast.error(errorMessage);
    } finally {
      setDownloadingId(null);
    }
  };

  const canDownload = (request: SyncEntity): boolean => {
    return request.entity_type === 3 && request.status === 3; // Export Products & Completed
  };

  if (loading && requests.length === 0) {
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          درخواست‌ها
        </h2>
        <div className="flex items-center gap-2">
          {refreshing && (
            <span className="text-sm text-body-color dark:text-dark-6">
              در حال به‌روزرسانی...
            </span>
          )}
          <svg
            className={`h-5 w-5 text-body-color dark:text-dark-6 ${refreshing ? 'animate-spin' : ''}`}
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
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
            هیچ درخواستی یافت نشد
          </h3>
          <p className="text-center text-base text-body-color dark:text-dark-6">
            درخواست‌های به‌روزرسانی شما در اینجا نمایش داده می‌شوند.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نوع</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>پیشرفت</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {ENTITY_TYPE_LABELS[request.entity_type] || "نامشخص"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[request.status]}`}
                    >
                      {STATUS_LABELS[request.status] || "نامشخص"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {request.total_pages && request.total_pages > 0 ? (
                      <div className="min-w-[200px]">
                        <div className="mb-1 flex items-center justify-between text-xs text-body-color dark:text-dark-6">
                          <span>
                            {request.processed_page || 0} از {request.total_pages}
                          </span>
                          <span>{getProgress(request)}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${getProgress(request)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-body-color dark:text-dark-6">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.created_at ? (
                      <div className="text-sm">
                        <div>{new Date(request.created_at).toLocaleDateString("fa-IR")}</div>
                        <div className="text-xs text-body-color dark:text-dark-6">
                          {new Date(request.created_at).toLocaleTimeString("fa-IR")}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canCancel(request.status) && (
                        <button
                          onClick={() => handleCancel(request.id)}
                          disabled={cancellingId === request.id}
                          className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === request.id ? "در حال لغو..." : "لغو"}
                        </button>
                      )}
                      {canDownload(request) && (
                        <button
                          onClick={() => handleDownload(request.id)}
                          disabled={downloadingId === request.id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="دانلود فایل CSV"
                        >
                          {downloadingId === request.id ? (
                            <>
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                              در حال دانلود...
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
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              دانلود
                            </>
                          )}
                        </button>
                      )}
                      {!canCancel(request.status) && !canDownload(request) && (
                        <span className="text-sm text-body-color dark:text-dark-6">-</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Load More */}
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-lg bg-primary px-8 py-3 text-center font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                    در حال بارگذاری...
                  </div>
                ) : (
                  "نمایش بیشتر"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
