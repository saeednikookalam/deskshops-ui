"use client";

import { Button } from "@/components/ui-elements/button";
import { Plugin } from "@/services/plugin";
import { Currency } from "@/components/ui/currency";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  plugin: Plugin | null;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (duration: 'monthly' | 'yearly') => void;
};

export function PluginDetailsModal({ plugin, isOpen, onClose, onSubscribe }: PropsType) {
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
  }, [isOpen, onClose]);

  if (!isOpen || !plugin || !mounted) return null;

  const shouldShowSubscribeButton = plugin.status === 'active' && !plugin.has_subscription;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-dark">
          {/* Header */}
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                جزئیات پلاگین
              </h3>
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-dark dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={onClose}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6">
            {/* Plugin Icon and Name */}
            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3 dark:bg-indigo-900">
                <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <rect x="9" y="9" width="6" height="6"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {plugin.display_name || plugin.name}
              </h3>
              {plugin.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plugin.description}
                </p>
              )}
            </div>

            {/* Plugin Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">نسخه:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{plugin.version || 'نامشخص'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">وضعیت:</span>
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  plugin.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {plugin.status === 'active' ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
              {plugin.user_count !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">کاربران:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {plugin.user_count.toLocaleString('fa-IR')}
                  </span>
                </div>
              )}
            </div>

            {/* Pricing Plans */}
            {(plugin.monthly_price || plugin.yearly_price) && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">انتخاب پلن اشتراک</h4>
                <div className="space-y-3">
                  {plugin.monthly_price && (
                    <div
                      className={`relative rounded-lg border p-4 cursor-pointer ${
                        selectedDuration === 'monthly'
                          ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setSelectedDuration('monthly')}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <label className="font-medium text-gray-900 dark:text-white">
                              پلن ماهانه
                            </label>
                            <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              <Currency value={parseFloat(plugin.monthly_price)} />
                            </p>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 ${
                          selectedDuration === 'monthly'
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedDuration === 'monthly' && (
                            <div className="h-full w-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {plugin.yearly_price && (
                    <div
                      className={`relative rounded-lg border p-4 cursor-pointer ${
                        selectedDuration === 'yearly'
                          ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setSelectedDuration('yearly')}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <label className="font-medium text-gray-900 dark:text-white">
                              پلن سالانه
                            </label>
                            <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              <Currency value={parseFloat(plugin.yearly_price)} />
                            </p>
                            {plugin.monthly_price && (
                              <p className="text-green-600 text-xs">
                                صرفه‌جویی {Math.round((1 - (parseFloat(plugin.yearly_price) / 12) / parseFloat(plugin.monthly_price)) * 100)}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 ${
                          selectedDuration === 'yearly'
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedDuration === 'yearly' && (
                            <div className="h-full w-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:border-gray-700">
            <div className="flex gap-3">
              {shouldShowSubscribeButton && onSubscribe && (
                <Button
                  label={`خرید اشتراک ${selectedDuration === 'monthly' ? 'ماهانه' : 'سالانه'}`}
                  variant="primary"
                  shape="rounded"
                  onClick={() => onSubscribe(selectedDuration)}
                />
              )}
              <Button
                label="بستن"
                variant="outlineDark"
                shape="rounded"
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}