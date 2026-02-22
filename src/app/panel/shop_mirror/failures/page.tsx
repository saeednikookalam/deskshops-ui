"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { shopMirrorService, type FailureRecord } from "@/services/shop-mirror";
import { showToast } from "@/lib/toast";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function FailuresPage() {
  // Data states
  const [failures, setFailures] = useState<FailureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Retry states
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    failureId: number | null;
    sku: string;
  }>({
    isOpen: false,
    failureId: null,
    sku: "",
  });

  // Infinite scroll refs
  const pageRef = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<string>("all");

  // Keep ref in sync with state
  statusFilterRef.current = statusFilter;

  const loadFailures = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const status = statusFilterRef.current === "all" ? undefined : statusFilterRef.current;
        const result = await shopMirrorService.getFailures(pageNum, 20, status);

        if (result) {
          if (append) {
            setFailures((prev) => [...prev, ...result.failures]);
          } else {
            setFailures(result.failures);
          }
          setHasMore(result.has_more);
        }
      } catch (error) {
        console.error("Error loading failures:", error);
        showToast.error("خطا در بارگذاری خطاها");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Load on mount and when filter changes
  useEffect(() => {
    pageRef.current = 1;
    loadFailures(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

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
          loadFailures(pageRef.current, true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
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

  const handleRetry = async (failureId: number) => {
    try {
      setRetryingId(failureId);
      await shopMirrorService.retryFailure(failureId);
      showToast.success("تلاش مجدد با موفقیت انجام شد");

      // Remove the retried failure from the list
      setFailures((prev) => prev.filter((f) => f.id !== failureId));
    } catch (error) {
      console.error("Error retrying failure:", error);
      showToast.error(error instanceof Error ? error.message : "خطا در تلاش مجدد");
    } finally {
      setRetryingId(null);
    }
  };

  const openRetryConfirm = (failure: FailureRecord) => {
    setConfirmModal({
      isOpen: true,
      failureId: failure.id,
      sku: failure.sku,
    });
  };

  const closeRetryConfirm = () => {
    setConfirmModal({
      isOpen: false,
      failureId: null,
      sku: "",
    });
  };

  const confirmRetry = () => {
    if (confirmModal.failureId) {
      handleRetry(confirmModal.failureId);
    }
    closeRetryConfirm();
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: "در انتظار",
      retrying: "در حال تلاش مجدد",
      dead_letter: "شکست خورده",
      resolved: "حل شده",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      retrying: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      dead_letter: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getOperationLabel = (operation: string): string => {
    const labels: Record<string, string> = {
      create: "ایجاد",
      update: "به‌روزرسانی",
      stock_update: "به‌روزرسانی موجودی",
      price_update: "به‌روزرسانی قیمت",
      status_update: "به‌روزرسانی وضعیت",
    };
    return labels[operation] || operation;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/panel/shop_mirror"
                className="text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary transition-colors"
              >
                آینه فروشگاه
              </Link>
              <svg
                className="h-4 w-4 text-body-color dark:text-dark-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm text-dark dark:text-white font-medium">مدیریت خطاها</span>
            </div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              خطاهای همگام‌سازی
            </h2>
            <p className="mt-2 text-sm text-body-color dark:text-dark-6">
              مشاهده و مدیریت خطاهای رخ داده در همگام‌سازی محصولات
            </p>
          </div>

          {/* Back Button */}
          <Link
            href="/panel/shop_mirror"
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark transition-all hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            بازگشت به آینه فروشگاه
          </Link>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-dark dark:text-white">فیلتر وضعیت:</span>
          {[
            { value: "all", label: "همه" },
            { value: "pending", label: "در انتظار" },
            { value: "retrying", label: "در حال تلاش مجدد" },
            { value: "dead_letter", label: "شکست خورده" },
            { value: "resolved", label: "حل شده" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === option.value
                  ? "bg-primary text-white"
                  : "bg-gray-1 text-body-color hover:bg-gray-2 dark:bg-dark-2 dark:text-dark-6 dark:hover:bg-dark-3"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && failures.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <p className="text-body-color dark:text-dark-6">در حال بارگذاری...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && failures.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-light-6 dark:bg-green/20">
            <svg
              className="h-12 w-12 text-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
            خطایی یافت نشد
          </h3>
          <p className="text-center text-base text-body-color dark:text-dark-6">
            در حال حاضر خطایی برای نمایش وجود ندارد.
          </p>
        </div>
      )}

      {/* Failures Table */}
      {failures.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <th className="py-4 px-4 text-right text-sm font-semibold text-dark dark:text-white">
                    شناسه
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-semibold text-dark dark:text-white">
                    SKU
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-semibold text-dark dark:text-white">
                    عملیات
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-semibold text-dark dark:text-white">
                    وضعیت
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-semibold text-dark dark:text-white">
                    تعداد تلاش
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-semibold text-dark dark:text-white">
                    تاریخ
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-semibold text-dark dark:text-white">
                    پیام خطا
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody>
                {failures.map((failure) => (
                  <tr
                    key={failure.id}
                    className="border-b border-stroke dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-2 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-dark dark:text-white">
                      #{failure.id}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-dark dark:text-white bg-gray-2 dark:bg-dark-3 px-2 py-1 rounded">
                        {failure.sku}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-body-color dark:text-dark-6">
                      {getOperationLabel(failure.operation)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          failure.status
                        )}`}
                      >
                        {getStatusLabel(failure.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-dark dark:text-white text-center">
                      {failure.retry_count}
                    </td>
                    <td className="py-4 px-4 text-sm text-body-color dark:text-dark-6 whitespace-nowrap">
                      {formatDate(failure.created_at)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-red-600 dark:text-red-400 max-w-xs truncate" title={failure.error_message}>
                        {failure.error_message}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {(failure.status === "pending" || failure.status === "retrying" || failure.status === "dead_letter") && (
                        <button
                          onClick={() => openRetryConfirm(failure)}
                          disabled={retryingId === failure.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {retryingId === failure.id ? (
                            <>
                              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                              در حال تلاش...
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              تلاش مجدد
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="تلاش مجدد"
        message={`آیا مطمئن هستید که می‌خواهید برای محصول با SKU "${confirmModal.sku}" تلاش مجدد انجام دهید؟`}
        confirmText="بله، تلاش مجدد"
        cancelText="انصراف"
        confirmVariant="primary"
        onConfirm={confirmRetry}
        onCancel={closeRetryConfirm}
      />
    </div>
  );
}
