"use client";

import { useEffect, useState } from "react";
import { ImportError, fileImporterService } from "@/services/file-importer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ErrorsListProps {
  importId: number;
  onClose: () => void;
}

export function ErrorsList({ importId, onClose }: ErrorsListProps) {
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalErrors, setTotalErrors] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  useEffect(() => {
    loadErrors();
  }, [importId, page]);

  const loadErrors = async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * limit;
      const data = await fileImporterService.getImportErrors(importId, limit, offset);
      setErrors(data.errors);
      setTotalErrors(data.total_errors);
    } catch (err) {
      console.error("Error loading import errors:", err);
      setError("خطا در بارگذاری لیست خطاها");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalErrors / limit);

  const getErrorTypeBadge = (errorType: number) => {
    const description = fileImporterService.getErrorTypeDescription(errorType);

    let colorClasses = "bg-gray-2 text-body-color dark:bg-dark-2";

    switch (errorType) {
      case 1: // فیلد الزامی
        colorClasses = "bg-red/10 text-red";
        break;
      case 2: // فرمت نامعتبر
        colorClasses = "bg-orange/10 text-orange";
        break;
      case 3: // مقدار تکراری
        colorClasses = "bg-yellow/10 text-yellow";
        break;
      case 4: // مقدار خارج از محدوده
        colorClasses = "bg-purple/10 text-purple";
        break;
    }

    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colorClasses}`}>
        {description}
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stroke bg-white p-6 dark:border-dark-3 dark:bg-gray-dark">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              لیست خطاها
            </h2>
            <p className="mt-1 text-sm text-body-color dark:text-dark-6">
              مجموع {totalErrors.toLocaleString('fa-IR')} خطا
            </p>
          </div>
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
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 160px)" }}>
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
                  onClick={loadErrors}
                  className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  تلاش مجدد
                </button>
              </div>
            </div>
          ) : errors.length === 0 ? (
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
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-base text-body-color dark:text-dark-6">
                  هیچ خطایی یافت نشد
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-dark [&>th]:dark:text-white">
                    <TableHead className="w-24 text-center">شماره سطر</TableHead>
                    <TableHead>نام فیلد</TableHead>
                    <TableHead>نوع خطا</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {errors.map((errorItem, index) => (
                    <TableRow
                      key={`${errorItem.row_number}-${errorItem.field}-${index}`}
                      className="border-[#eee] dark:border-dark-3"
                    >
                      <TableCell className="text-center">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red/10 font-mono text-sm font-medium text-red">
                          {errorItem.row_number.toLocaleString('fa-IR')}
                        </span>
                      </TableCell>

                      <TableCell>
                        <code className="rounded bg-gray-2 px-2 py-1 text-sm font-medium text-dark dark:bg-dark-2 dark:text-white">
                          {errorItem.field}
                        </code>
                      </TableCell>

                      <TableCell>
                        {getErrorTypeBadge(errorItem.error_type)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="sticky bottom-0 border-t border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <p className="text-sm text-body-color dark:text-dark-6">
                صفحه {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stroke text-body-color transition hover:bg-gray-2 hover:text-dark disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2 dark:hover:text-white"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stroke text-body-color transition hover:bg-gray-2 hover:text-dark disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2 dark:hover:text-white"
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
