"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fileImporterService, ImportDetailResponse } from "@/services/file-importer";
import { ImportDetailHeader } from "@/components/file-importer/ImportDetailHeader";
import { ImportErrorsTable } from "@/components/file-importer/ImportErrorsTable";

export default function ImportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const importId = Number(params.import_id);

  const [detail, setDetail] = useState<ImportDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
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
  }, [importId]);

  useEffect(() => {
    if (isNaN(importId)) {
      router.push("/panel/file_importer");
      return;
    }

    void loadDetail();
  }, [importId, loadDetail, router]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
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
          <p className="text-base text-red">{error || "اطلاعاتی یافت نشد"}</p>
          <button
            onClick={() => router.push("/panel/file_importer")}
            className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            بازگشت به لیست
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats cards */}
      <ImportDetailHeader detail={detail} />

      {/* Errors Table with infinite scroll */}
      <ImportErrorsTable importId={importId} totalErrors={detail.error_count} />
    </div>
  );
}
