"use client";

import { useState, useRef } from "react";
import { fileImporterService } from "@/services/file-importer";

interface UploadFormProps {
  onUploadSuccess: () => void;
  onUploadError: (error: string) => void;
}

export function UploadForm({ onUploadSuccess, onUploadError }: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = '.csv,.xlsx,.xls,.json';
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (file: File) => {
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['csv', 'xlsx', 'xls', 'json'].includes(fileExtension)) {
      onUploadError('فقط فایل‌های CSV، Excel و JSON پشتیبانی می‌شوند');
      return;
    }

    // Check file size
    if (file.size > maxFileSize) {
      onUploadError('حجم فایل نباید بیشتر از 10 مگابایت باشد');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onUploadError('لطفاً یک فایل انتخاب کنید');
      return;
    }

    try {
      setUploading(true);
      await fileImporterService.uploadFile(selectedFile);

      // If no error thrown, upload was successful
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطا در آپلود فایل. لطفاً دوباره تلاش کنید';
      onUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-8">
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            بارگذاری فایل
          </h1>
          <p className="mt-2 text-sm text-body-color dark:text-dark-6">
            فایل‌های CSV، Excel یا JSON خود را آپلود کنید و به صورت خودکار پردازش شوند
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-blue/10 px-4 py-2.5">
          <svg
            className="h-5 w-5 text-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-blue">
            حداکثر حجم: 10MB
          </span>
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative mb-5 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-stroke dark:border-dark-3'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />

        {!selectedFile ? (
          <div>
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <p className="mb-2 text-base font-medium text-dark dark:text-white">
              فایل را اینجا بکشید یا کلیک کنید
            </p>
            <p className="text-sm text-body-color dark:text-dark-6">
              فرمت‌های پشتیبانی شده: CSV, Excel, JSON (حداکثر 10MB)
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              انتخاب فایل
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
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
            </div>

            <p className="mb-1 text-base font-medium text-dark dark:text-white">
              {selectedFile.name}
            </p>
            <p className="mb-4 text-sm text-body-color dark:text-dark-6">
              {formatFileSize(selectedFile.size)}
            </p>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark transition hover:bg-gray-2 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                حذف
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark transition hover:bg-gray-2 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                تغییر فایل
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
              در حال آپلود...
            </>
          ) : (
            <>
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              آپلود و شروع پردازش
            </>
          )}
        </button>
      )}
    </div>
  );
}
