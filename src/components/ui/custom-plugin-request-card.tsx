"use client";

import { cn } from "@/lib/utils";

type PropsType = {
  onClick?: () => void;
};

export function CustomPluginRequestCard({ onClick }: PropsType) {
  return (
    <div
      className={cn(
        "rounded-[10px] bg-gradient-to-br from-primary/5 to-purple/5 dark:from-primary/10 dark:to-purple/10 p-4 shadow-1 dark:bg-gray-dark transition-all hover:shadow-lg h-full flex flex-col cursor-pointer relative border-2 border-dashed border-primary/30 dark:border-primary/40 hover:border-primary/60"
      )}
      onClick={onClick}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">
          <div className="text-primary bg-primary/10 dark:bg-primary/20 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-dark dark:text-white">درخواست پلاگین سفارشی</h3>
        </div>
        <div className="flex-shrink-0 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
          جدید
        </div>
      </div>

      {/* Description */}
      <div className="mb-3 h-12 flex items-start">
        <p className="text-base text-body-color dark:text-dark-6 leading-relaxed line-clamp-2">
          نیاز به یک پلاگین اختصاصی دارید؟ ما برای شما می‌سازیم! روی این کارت کلیک کنید و درخواست خود را ثبت کنید.
        </p>
      </div>

      {/* Call to Action */}
      <div className="mb-3 flex items-center">
        <div className="w-full p-2 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30">
          <div className="flex items-center justify-center text-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-medium text-sm">ثبت درخواست رایگان</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-center text-sm text-body-color dark:text-dark-6 h-5">
        <span>پاسخگویی سریع و حرفه‌ای</span>
      </div>
    </div>
  );
}
