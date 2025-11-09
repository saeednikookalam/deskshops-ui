"use client";

import { Button } from "@/components/ui-elements/button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CurrencyInput } from "@/components/ui/currency-input";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  isProcessing?: boolean;
};

export function AddCreditModal({ isOpen, onClose, onSubmit, isProcessing = false }: PropsType) {
  const [amount, setAmount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
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
  }, [isOpen, onClose, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // amount به ریال است، به API ارسال می‌شود
    if (amount >= 100000) {
      onSubmit(amount);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setAmount(0);
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

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
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md dark:bg-gray-dark" dir="rtl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                افزایش اعتبار
              </h3>
              <button
                type="button"
                className="rounded-md bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:bg-gray-dark dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={handleClose}
                disabled={isProcessing}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  مبلغ (تومان) <span className="text-red">*</span>
                </label>
                <CurrencyInput
                  name="amount"
                  value={amount}
                  onChange={setAmount}
                  placeholder="مبلغ مورد نظر را وارد کنید"
                  required
                  disabled={isProcessing}
                  min={10000}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  حداقل مبلغ: ۱۰,۰۰۰ تومان
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700 flex gap-3 flex-row-reverse">
              <Button
                type="submit"
                label={isProcessing ? "در حال پردازش..." : "پرداخت"}
                variant="primary"
                shape="rounded"
                disabled={isProcessing || amount < 100000}
              />
              <Button
                type="button"
                label="انصراف"
                variant="outlineDark"
                shape="rounded"
                onClick={handleClose}
                disabled={isProcessing}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
