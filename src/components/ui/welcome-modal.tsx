"use client";

import { Button } from "@/components/ui-elements/button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
};

export function WelcomeModal({ isOpen, userName, onClose }: PropsType) {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Start animation after a short delay
      setTimeout(() => setIsAnimating(true), 100);
    } else {
      setIsAnimating(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 999999 }}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-80 transition-opacity backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-center shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-dark ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          dir="rtl"
        >
          {/* Content */}
          <div className="relative px-6 pt-12 pb-8 space-y-6">

            {/* Welcome text */}
            <div className="space-y-3">
              <h2 className={`text-3xl font-bold text-dark dark:text-white transition-all duration-500 ${
                isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                خوش آمدید {userName}! 🎉
              </h2>
              <p className={`text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto transition-all duration-500 delay-100 ${
                isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                از اینکه به ما پیوستید بسیار خوشحالیم! امیدواریم تجربه‌ای عالی و لذت‌بخش داشته باشید
              </p>
            </div>

            {/* Features */}
            <div className={`grid grid-cols-3 gap-4 max-w-md mx-auto transition-all duration-500 delay-200 ${
              isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-2 dark:bg-dark-2">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">امن و سریع</span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-2 dark:bg-dark-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">قدرتمند</span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-2 dark:bg-dark-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">انعطاف‌پذیر</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`bg-gray-50 dark:bg-dark-2 px-6 py-4 transition-all duration-500 delay-300 ${
            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <Button
              label="شروع کنیم! 🚀"
              variant="primary"
              shape="rounded"
              className="w-full"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
