"use client";

import { ImportDetailData, fileImporterService } from "@/services/file-importer";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";

dayjs.extend(relativeTime);
dayjs.locale("fa");

interface ImportDetailHeaderProps {
  detail: ImportDetailData;
}

export function ImportDetailHeader({ detail }: ImportDetailHeaderProps) {
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
    if (detail.total_rows === 0) return 0;
    return Math.round((detail.success_count / detail.total_rows) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">
              جزئیات Import #{detail.import_id}
            </h1>
            <p className="mt-1 text-sm text-body-color dark:text-dark-6">
              {dayjs(detail.created_at).format("YYYY/MM/DD - HH:mm")} ({dayjs(detail.created_at).fromNow()})
            </p>
          </div>
          <div className={getStatusBadgeClasses(detail.status)}>
            {detail.status === 1 && (
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-current"></span>
            )}
            {fileImporterService.getStatusDescription(detail.status)}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Total Rows */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-2">
            <svg
              className="h-6 w-6 text-dark dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <div className="mt-6">
            <div className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
              {detail.total_rows.toLocaleString('fa-IR')}
            </div>
            <div className="text-sm font-medium text-dark-6">کل سطرها</div>
          </div>
        </div>

        {/* Success Count */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#219653]/10">
            <svg
              className="h-6 w-6 text-[#219653]"
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

          <div className="mt-6">
            <div className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
              {detail.success_count.toLocaleString('fa-IR')}
            </div>
            <div className="text-sm font-medium text-dark-6">موفق</div>
          </div>
        </div>

        {/* Error Count */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#D34053]/10">
            <svg
              className="h-6 w-6 text-[#D34053]"
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

          <div className="mt-6">
            <div className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
              {detail.error_count.toLocaleString('fa-IR')}
            </div>
            <div className="text-sm font-medium text-dark-6">خطا</div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>

          <div className="mt-6">
            <div className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
              {calculateSuccessRate().toLocaleString('fa-IR')}%
            </div>
            <div className="text-sm font-medium text-dark-6">نرخ موفقیت</div>
          </div>
        </div>
      </div>
    </div>
  );
}
