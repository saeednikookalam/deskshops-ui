"use client";

import { useEffect, useState } from "react";
import { ImportDetailResponse, fileImporterService } from "@/services/file-importer";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/common/Portal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";

dayjs.extend(relativeTime);
dayjs.locale("fa");

interface ImportDetailProps {
  importId: number;
  onClose: () => void;
  onViewErrors?: () => void;
}

export function ImportDetail({ importId, onClose, onViewErrors }: ImportDetailProps) {
  const [detail, setDetail] = useState<ImportDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDetail();
  }, [importId]);

  const loadDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fileImporterService.getImportDetail(importId);
      setDetail(data);
    } catch (err) {
      console.error("Error loading import detail:", err);
      setError("خطا در بارگذاری اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClasses = (status: number): string => {
    const baseClasses = "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium";

    switch (status) {
      case 0:
        return cn(baseClasses, "bg-blue/10 text-blue");
      case 1:
        return cn(baseClasses, "bg-[#FFA70B]/10 text-[#FFA70B]");
      case 2:
        return cn(baseClasses, "bg-[#219653]/10 text-[#219653]");
      case 3:
        return cn(baseClasses, "bg-[#D34053]/10 text-[#D34053]");
      default:
        return cn(baseClasses, "bg-gray-2 text-body-color dark:bg-dark-2");
    }
  };

  const calculateSuccessRate = () => {
    if (!detail || detail.total_rows === 0) return 0;
    return Math.round((detail.success_count / detail.total_rows) * 100);
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stroke bg-white p-6 dark:border-dark-3 dark:bg-gray-dark">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            جزئیات Import
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-body-color transition hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-2 dark:hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                <p className="text-body-color dark:text-dark-6">در حال بارگذاری...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <svg
                    className="h-16 w-16 text-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-base text-red">{error}</p>
                <button
                  onClick={loadDetail}
                  className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  تلاش مجدد
                </button>
              </div>
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <div className={getStatusBadgeClasses(detail.status)}>
                  {detail.status === 1 && (
                    <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-current"></span>
                  )}
                  {fileImporterService.getStatusDescription(detail.status)}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-gray-2 p-4 dark:bg-dark-2">
                  <p className="mb-1 text-xs text-body-color dark:text-dark-6">
                    کل سطرها
                  </p>
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {detail.total_rows.toLocaleString('fa-IR')}
                  </p>
                </div>

                <div className="rounded-lg bg-[#219653]/10 p-4">
                  <p className="mb-1 text-xs text-[#219653]">موفق</p>
                  <p className="text-2xl font-bold text-[#219653]">
                    {detail.success_count.toLocaleString('fa-IR')}
                  </p>
                </div>

                <div className="rounded-lg bg-[#D34053]/10 p-4">
                  <p className="mb-1 text-xs text-[#D34053]">خطا</p>
                  <p className="text-2xl font-bold text-[#D34053]">
                    {detail.error_count.toLocaleString('fa-IR')}
                  </p>
                </div>

                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="mb-1 text-xs text-primary">نرخ موفقیت</p>
                  <p className="text-2xl font-bold text-primary">
                    {calculateSuccessRate().toLocaleString('fa-IR')}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {detail.total_rows > 0 && (
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-body-color dark:text-dark-6">پیشرفت</span>
                    <span className="font-medium text-dark dark:text-white">
                      {calculateSuccessRate().toLocaleString('fa-IR')}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-2 dark:bg-dark-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                      style={{ width: `${calculateSuccessRate()}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-4 rounded-lg border border-stroke bg-gray-2/50 p-5 dark:border-dark-3 dark:bg-dark-2/50">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-body-color dark:text-dark-6">
                    شناسه Import
                  </span>
                  <span className="font-mono text-sm font-medium text-dark dark:text-white">
                    #{detail.import_id}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-sm text-body-color dark:text-dark-6">
                    نوع فایل
                  </span>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {detail.file_type.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-sm text-body-color dark:text-dark-6">
                    تاریخ ایجاد
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {dayjs(detail.created_at).format("YYYY/MM/DD - HH:mm")}
                    </p>
                    <p className="mt-0.5 text-xs text-body-color dark:text-dark-6">
                      {dayjs(detail.created_at).fromNow()}
                    </p>
                  </div>
                </div>

                {detail.completed_at && (
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-body-color dark:text-dark-6">
                      تاریخ تکمیل
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {dayjs(detail.completed_at).format("YYYY/MM/DD - HH:mm")}
                      </p>
                      <p className="mt-0.5 text-xs text-body-color dark:text-dark-6">
                        {dayjs(detail.completed_at).fromNow()}
                      </p>
                    </div>
                  </div>
                )}

                {detail.created_at && detail.completed_at && (
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-body-color dark:text-dark-6">
                      مدت زمان پردازش
                    </span>
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {dayjs(detail.completed_at).diff(dayjs(detail.created_at), 'second')} ثانیه
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {detail.error_count > 0 && onViewErrors && (
                <button
                  onClick={onViewErrors}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red/10 px-6 py-3 text-sm font-medium text-red transition hover:bg-red/20"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  مشاهده {detail.error_count.toLocaleString('fa-IR')} خطا
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
      </div>
    </Portal>
  );
}
