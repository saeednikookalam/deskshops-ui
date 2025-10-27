"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { showToast } from "@/lib/toast";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
};

export function CustomPluginRequestModal({ isOpen, onClose }: PropsType) {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      showToast.error("لطفاً توضیحات درخواست خود را وارد کنید");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: اینجا باید API call بزنیم
      // await apiClient.post('/plugin-requests', { description });

      // فعلاً فقط یه تاخیر مصنوعی برای نمایش loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast.success("درخواست شما با موفقیت ثبت شد. به زودی با شما تماس می‌گیریم!");
      setDescription("");
      onClose();
    } catch (error) {
      showToast.error("خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.");
      console.error("Error submitting plugin request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] rounded-[10px] bg-white dark:bg-gray-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-stroke dark:border-dark-3 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-dark dark:text-white">
              درخواست پلاگین سفارشی
            </h3>
            <button
              onClick={onClose}
              className="text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            <div className="mb-4">
              <label className="mb-2.5 block text-sm font-medium text-dark dark:text-white">
                توضیحات درخواست
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="لطفاً درخواست خود را به طور کامل شرح دهید. مثلاً: نیاز به یک پلاگین برای مدیریت موجودی انبار با امکان اتصال به نرم‌افزار حسابداری دارم."
                rows={6}
                className="w-full rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary resize-none"
                disabled={isSubmitting}
              />
              <p className="mt-2 text-xs text-body-color dark:text-dark-6">
                هرچه توضیحات شما دقیق‌تر باشد، ما بهتر می‌توانیم پلاگین مورد نیاز شما را بسازیم.
              </p>
            </div>

            {/* Info Box */}
            <div className="rounded-[10px] bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-primary mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-body-color dark:text-dark-6 leading-relaxed">
                    پس از ثبت درخواست، تیم ما درخواست شما را بررسی کرده و در اسرع وقت از طریق تلفن یا ایمیل با شما تماس خواهند گرفت.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-stroke dark:border-dark-3 px-6 py-4">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[5px] border border-stroke dark:border-dark-3 px-6 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark-2 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                انصراف
              </button>
              <button
                type="submit"
                className="rounded-[5px] bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    در حال ثبت...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    ثبت درخواست
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
