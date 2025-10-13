"use client";

import { Import, fileImporterService } from "@/services/file-importer";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";

dayjs.extend(relativeTime);
dayjs.locale("fa");

interface ImportsListProps {
  imports: Import[];
  loading: boolean;
  onViewDetail: (importId: number) => void;
  onViewErrors: (importId: number) => void;
}

export function ImportsList({
  imports,
  loading,
  onViewDetail,
  onViewErrors,
}: ImportsListProps) {
  const getStatusBadgeClasses = (status: number): string => {
    const baseClasses = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium";

    switch (status) {
      case 0: // در انتظار
        return cn(baseClasses, "bg-blue/10 text-blue");
      case 1: // در حال پردازش
        return cn(baseClasses, "bg-[#FFA70B]/10 text-[#FFA70B]");
      case 2: // تکمیل شده
        return cn(baseClasses, "bg-[#219653]/10 text-[#219653]");
      case 3: // خطا
        return cn(baseClasses, "bg-[#D34053]/10 text-[#D34053]");
      default:
        return cn(baseClasses, "bg-gray-2 text-body-color dark:bg-dark-2");
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    const lowerType = fileType.toLowerCase();

    if (lowerType.includes('csv')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
        </svg>
      );
    } else if (lowerType.includes('xls') || lowerType.includes('excel')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L13 1.586A2 2 0 0011.586 1H9z" />
        </svg>
      );
    } else if (lowerType.includes('json')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            تاریخچه
          </h2>
        </div>
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <p className="text-body-color dark:text-dark-6">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (imports.length === 0) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            تاریخچه
          </h2>
          <p className="mt-1 text-sm text-body-color dark:text-dark-6">
            حداکثر 5 مورد آخر نمایش داده می‌شود
          </p>
        </div>
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <svg
                className="h-16 w-16 text-body-color dark:text-dark-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-base text-body-color dark:text-dark-6">
              هنوز هیچ فایلی بارگذاری نشده است
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark dark:text-white">
          تاریخچه
        </h2>
        <p className="mt-1 text-sm text-body-color dark:text-dark-6">
          {imports.length} مورد اخیر (حداکثر 5 مورد آخر نمایش داده می‌شود)
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="w-20">شناسه</TableHead>
              <TableHead className="min-w-[140px]">نوع فایل</TableHead>
              <TableHead>تاریخ</TableHead>
              <TableHead className="text-center">کل سطرها</TableHead>
              <TableHead className="text-center">موفق</TableHead>
              <TableHead className="text-center">خطا</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {imports.map((importItem) => (
              <TableRow
                key={importItem.import_id}
                className="border-[#eee] dark:border-dark-3"
              >
                <TableCell>
                  <span className="font-mono text-sm font-medium text-dark dark:text-white">
                    #{importItem.import_id}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-2 text-body-color dark:bg-dark-2 dark:text-dark-6">
                      {getFileTypeIcon(importItem.file_type)}
                    </div>
                    <span className="font-medium text-dark dark:text-white">
                      {importItem.file_type.toUpperCase()}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <p className="text-sm text-dark dark:text-white">
                    {dayjs(importItem.created_at).format("YYYY/MM/DD")}
                  </p>
                  <p className="mt-0.5 text-xs text-body-color dark:text-dark-6">
                    {dayjs(importItem.created_at).format("HH:mm")}
                  </p>
                </TableCell>

                <TableCell className="text-center">
                  <span className="font-medium text-dark dark:text-white">
                    {importItem.total_rows.toLocaleString('fa-IR')}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <span className="font-medium text-[#219653]">
                    {importItem.success_count.toLocaleString('fa-IR')}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <span className="font-medium text-[#D34053]">
                    {importItem.error_count.toLocaleString('fa-IR')}
                  </span>
                </TableCell>

                <TableCell>
                  <div className={getStatusBadgeClasses(importItem.status)}>
                    {importItem.status === 1 && (
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-current"></span>
                    )}
                    {fileImporterService.getStatusDescription(importItem.status)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-start gap-2">
                    <button
                      onClick={() => onViewDetail(importItem.import_id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20"
                      title="مشاهده جزئیات"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      جزئیات
                    </button>

                    {importItem.error_count > 0 && (
                      <button
                        onClick={() => onViewErrors(importItem.import_id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red/10 px-3 py-1.5 text-xs font-medium text-red transition hover:bg-red/20"
                        title="مشاهده خطاها"
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        خطاها
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
