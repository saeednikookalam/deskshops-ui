"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  onExport: (status: string) => void;
  isExporting?: boolean;
};

export function ExportProductsModal({ isOpen, onClose, onExport, isExporting = false }: PropsType) {
  const [mounted, setMounted] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isExporting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isExporting]);

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus("all");
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleExport = () => {
    onExport(selectedStatus);
  };

  const modalContent = (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 999999 }}
    >
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={!isExporting ? onClose : undefined}
        />

        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 dark:bg-gray-dark" dir="rtl">
          <div>
            {/* Close button - only show if not exporting */}
            {!isExporting && (
              <div className="absolute left-0 top-0 pl-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 dark:bg-gray-dark dark:text-gray-300 dark:hover:text-gray-200"
                  onClick={onClose}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div className="mt-3 text-center sm:mt-5">
              {/* Title */}
              <h3 className="text-lg font-semibold leading-6 text-dark dark:text-white">
                خروجی محصولات
              </h3>

              {/* Description */}
              <div className="mt-2">
                <p className="text-sm text-body-color dark:text-dark-6">
                  فایل Excel محصولات با فیلترهای انتخابی دانلود می‌شود
                </p>
              </div>

              {/* Filter */}
              <div className="mt-6 text-right">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  وضعیت محصولات
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={isExporting}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-dark outline-none transition focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  <option value="all">همه محصولات</option>
                  <option value="active">فقط فعال</option>
                  <option value="inactive">فقط غیرفعال</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-dark transition-all hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              لغو
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                  در حال دانلود...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  دانلود
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
