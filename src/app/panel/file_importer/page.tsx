"use client";

import { useEffect, useState, useCallback } from "react";
import { fileImporterService, Import } from "@/services/file-importer";
import { UploadForm } from "@/components/file-importer/UploadForm";
import { ImportsList } from "@/components/file-importer/ImportsList";
import { ImportDetail } from "@/components/file-importer/ImportDetail";
import { ErrorsList } from "@/components/file-importer/ErrorsList";
import { Alert } from "@/components/common/Alert";
import { Toast } from "@/components/common/Toast";

type AlertType = "success" | "error" | "warning";

export default function FileImporterPage() {
  const [imports, setImports] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; message: string }[]>([]);

  // Modal states
  const [selectedImportId, setSelectedImportId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showErrorsModal, setShowErrorsModal] = useState(false);

  // Auto-refresh for processing imports
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const addToast = useCallback((type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const loadImports = useCallback(async () => {
    try {
      const data = await fileImporterService.getImports();
      setImports(data.imports);

      // Check if there are any processing imports
      const hasProcessing = data.imports.some(
        (imp) => imp.status === 0 || imp.status === 1
      );

      // Start auto-refresh if there are processing imports
      if (hasProcessing && !refreshInterval) {
        const interval = setInterval(() => {
          loadImports();
        }, 5000); // Refresh every 5 seconds
        setRefreshInterval(interval);
      } else if (!hasProcessing && refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    } catch (error) {
      console.error("Error loading imports:", error);
      addToast("error", "خطا در بارگذاری لیست import ها");
    } finally {
      setLoading(false);
    }
  }, [refreshInterval, addToast]);

  useEffect(() => {
    loadImports();

    // Cleanup interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadSuccess = () => {
    addToast("success", "فایل با موفقیت آپلود شد و در حال پردازش است");
    setAlert({
      type: "success",
      message: "فایل شما با موفقیت آپلود شد و در حال پردازش است. می‌توانید در لیست زیر وضعیت آن را مشاهده کنید.",
    });
    loadImports();
  };

  const handleUploadError = (error: string) => {
    addToast("error", error);
  };

  const handleViewDetail = (importId: number) => {
    setSelectedImportId(importId);
    setShowDetailModal(true);
  };

  const handleViewErrors = (importId: number) => {
    setSelectedImportId(importId);
    setShowErrorsModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedImportId(null);
  };

  const handleCloseErrorsModal = () => {
    setShowErrorsModal(false);
    setSelectedImportId(null);
  };

  const handleViewErrorsFromDetail = () => {
    setShowDetailModal(false);
    setShowErrorsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-2 sm:right-4 sm:left-auto">
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Upload Form (includes header) */}
      <UploadForm
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />

      {/* Imports List */}
      <ImportsList
        imports={imports}
        loading={loading}
        onViewDetail={handleViewDetail}
        onViewErrors={handleViewErrors}
      />

      {/* Modals */}
      {showDetailModal && selectedImportId && (
        <ImportDetail
          importId={selectedImportId}
          onClose={handleCloseDetailModal}
          onViewErrors={handleViewErrorsFromDetail}
        />
      )}

      {showErrorsModal && selectedImportId && (
        <ErrorsList
          importId={selectedImportId}
          onClose={handleCloseErrorsModal}
        />
      )}
    </div>
  );
}
