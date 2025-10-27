"use client";

import { useEffect, useState, useCallback } from "react";
import { fileImporterService, Import } from "@/services/file-importer";
import { UploadForm } from "@/components/file-importer/UploadForm";
import { ImportsList } from "@/components/file-importer/ImportsList";
import { Alert } from "@/components/common/Alert";
import { showToast } from "@/lib/toast";

type AlertType = "success" | "error" | "warning";

export default function FileImporterPage() {
  const [imports, setImports] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const loadImports = useCallback(async () => {
    try {
      const response = await fileImporterService.getImports();
      setImports(response.imports);
    } catch (error) {
      console.error("Error loading imports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadSuccess = () => {
    showToast.success("فایل با موفقیت آپلود شد و در حال پردازش است");
    setAlert({
      type: "success",
      message: "فایل شما با موفقیت آپلود شد و در حال پردازش است. می‌توانید در لیست زیر وضعیت آن را مشاهده کنید.",
    });
    loadImports();
  };

  const handleUploadError = (error: string) => {
    showToast.error(error);
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

      {/* Upload Form (includes header) */}
      <UploadForm
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />

      {/* Imports List */}
      <ImportsList
        imports={imports}
        loading={loading}
      />
    </div>
  );
}
