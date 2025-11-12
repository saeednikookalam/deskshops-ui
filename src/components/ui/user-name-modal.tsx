"use client";

import { Button } from "@/components/ui-elements/button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  isProcessing?: boolean;
};

export function UserNameModal({ isOpen, onSubmit, isProcessing = false }: PropsType) {
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("نام باید حداقل ۲ کاراکتر باشد");
      return;
    }

    if (trimmedName.length > 50) {
      setError("نام نباید بیشتر از ۵۰ کاراکتر باشد");
      return;
    }

    setError("");
    onSubmit(trimmedName);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 999999 }}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop - can't be closed */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-80 transition-opacity backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-right shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md dark:bg-gray-dark" dir="rtl">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500" />

          {/* Icon */}
          <div className="px-6 pt-8 pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 ring-8 ring-primary/5">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 pb-6 space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  خوش آمدید! 👋
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  لطفاً نام خود را وارد کنید تا بتوانیم شما را بهتر بشناسیم و تجربه شخصی‌سازی‌شده‌تری برایتان فراهم کنیم
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  نام شما <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="مثال: علی احمدی"
                  className={`w-full rounded-lg border px-4 py-3 text-dark outline-none transition focus:border-primary dark:bg-dark-2 dark:text-white ${
                    error ? 'border-red' : 'border-stroke dark:border-dark-3'
                  }`}
                  disabled={isProcessing}
                  autoFocus
                  required
                />
                {error && (
                  <p className="mt-2 text-sm text-red flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-dark-2 px-6 py-4">
              <Button
                type="submit"
                label={isProcessing ? "در حال ذخیره..." : "ادامه"}
                variant="primary"
                shape="rounded"
                className="w-full"
                disabled={isProcessing || !name.trim()}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
