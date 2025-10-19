"use client";

import { Button } from "@/components/ui-elements/button";
import { useEffect } from "react";

type PropsType = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'green' | 'dark' | 'outlinePrimary' | 'outlineGreen' | 'outlineDark';
  onConfirm: () => void;
  onCancel: () => void;
  isWarning?: boolean;
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "تأیید",
  cancelText = "انصراف",
  confirmVariant = "primary",
  onConfirm,
  onCancel
}: PropsType) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
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
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onCancel}
        />

        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-gray-dark">
          <div>
            {/* Warning Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg
                className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
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
            </div>

            <div className="mt-3 text-center sm:mt-5">
              {/* Close button */}
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-dark dark:text-gray-300"
                  onClick={onCancel}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold leading-6 text-dark dark:text-white">
                {title}
              </h3>

              {/* Message */}
              <div className="mt-2">
                <p className="text-sm text-body-color dark:text-dark-6 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <Button
              label={confirmText}
              variant={confirmVariant}
              shape="rounded"
              className="w-full sm:col-start-2"
              onClick={onConfirm}
            />
            <Button
              label={cancelText}
              variant="outlineDark"
              shape="rounded"
              className="w-full mt-3 sm:col-start-1 sm:mt-0"
              onClick={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
