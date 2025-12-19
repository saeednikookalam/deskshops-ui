"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fileImporterService, Import } from "@/services/file-importer";
import { UploadForm } from "@/components/file-importer/UploadForm";
import { ImportsList } from "@/components/file-importer/ImportsList";
import { FileGuide } from "@/components/file-importer/FileGuide";
import { SampleFiles } from "@/components/file-importer/SampleFiles";
import { Alert } from "@/components/common/Alert";
import { showToast } from "@/lib/toast";

type AlertType = "success" | "error" | "warning";
type TabType = "upload" | "guide" | "samples";

export default function FileImporterPage() {
  const [activeTab, setActiveTab] = useState<TabType>("upload");
  const [imports, setImports] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const initialLoadDone = useRef(false);

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
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadImports();
    }
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

      {/* Tabs Container */}
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Tab Headers */}
        <div className="border-b border-stroke dark:border-dark-3">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "upload"
                  ? "border-primary text-primary"
                  : "border-transparent text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              آپلود و لیست
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "guide"
                  ? "border-primary text-primary"
                  : "border-transparent text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              راهنمای استفاده
            </button>
            <button
              onClick={() => setActiveTab("samples")}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "samples"
                  ? "border-primary text-primary"
                  : "border-transparent text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              فایل‌های نمونه
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === "upload" && (
            <div className="space-y-6">
              {/* Upload Form (includes header) */}
              <UploadForm
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />

              {/* Imports List */}
              <ImportsList imports={imports} loading={loading} />
            </div>
          )}

          {activeTab === "guide" && <FileGuide />}

          {activeTab === "samples" && <SampleFiles />}
        </div>
      </div>
    </div>
  );
}
