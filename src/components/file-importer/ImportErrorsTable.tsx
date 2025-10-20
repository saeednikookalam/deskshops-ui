"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fileImporterService, ImportError } from "@/services/file-importer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ImportErrorsTableProps {
  importId: number;
  totalErrors: number;
}

const LIMIT = 50; // Load 50 errors at a time

export function ImportErrorsTable({ importId, totalErrors }: ImportErrorsTableProps) {
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const observerTarget = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const response = await fileImporterService.getImportErrors(importId, LIMIT, offset);

      setErrors((prev) => {
        const newErrors = [...prev, ...response.errors];
        // Check if there are more errors to load
        if (newErrors.length >= totalErrors || response.errors.length < LIMIT) {
          setHasMore(false);
        }
        return newErrors;
      });

      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error("Error loading errors:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [importId, offset, loading, hasMore, totalErrors]);

  useEffect(() => {
    setErrors([]);
    setOffset(0);
    setHasMore(true);
    setInitialLoading(true);
    initialLoadDone.current = false;
  }, [importId, totalErrors]);

  // Initial load
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      void loadMore();
    }
  }, [loadMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          void loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
      observer.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  if (initialLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            لیست خطاها
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

  if (errors.length === 0) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            لیست خطاها
          </h2>
          <p className="mt-1 text-sm text-body-color dark:text-dark-6">
            {totalErrors.toLocaleString('fa-IR')} خطا
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-base text-body-color dark:text-dark-6">
              هیچ خطایی یافت نشد
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
          لیست خطاها
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="w-32">شماره سطر</TableHead>
              <TableHead className="min-w-[200px]">فیلد</TableHead>
              <TableHead>نوع خطا</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {errors.map((error, index) => (
              <TableRow
                key={`${error.row_number}-${error.field}-${index}`}
                className="border-[#eee] dark:border-dark-3"
              >
                <TableCell>
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {error.row_number.toLocaleString('fa-IR')}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-mono text-sm text-dark dark:text-white">
                    {error.field}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="inline-flex items-center gap-2 rounded-full bg-red/10 px-3 py-1 text-sm font-medium text-red">
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
                    {fileImporterService.getErrorTypeDescription(error.error_type)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
              <span className="text-sm text-body-color dark:text-dark-6">
                در حال بارگذاری...
              </span>
            </div>
          </div>
        )}

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-4" />
      </div>
    </div>
  );
}
