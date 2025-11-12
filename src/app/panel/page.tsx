"use client";

import { useRouter } from "next/navigation";

export default function PanelPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-dark dark:text-white md:text-5xl">
            مدیریت آسان فروشگاه‌های آنلاین
          </h1>
          <p className="mb-8 text-lg text-body-color dark:text-dark-6 md:text-xl">
            با نصب برنامک‌های متنوع، کارهایتان را خودکار کنید و تمام فروشگاه‌هایتان را از یک جا و با هزینه‌ای کمتر مدیریت کنید
          </p>
          <button
            onClick={() => router.push('/panel/plugins')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-medium text-white transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:text-lg"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            مشاهده برنامک‌ها
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Feature 1 */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
            برنامک‌های متنوع
          </h3>
          <p className="text-base text-body-color dark:text-dark-6">
            دسترسی به انواع برنامک برای خودکارسازی کارهای تکراری و افزایش بهره‌وری
          </p>
        </div>

        {/* Feature 2 */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
            <svg className="h-7 w-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
            مدیریت یکپارچه
          </h3>
          <p className="text-base text-body-color dark:text-dark-6">
            مدیریت همه فروشگاه‌ها و پلتفرم‌های فروش از یک پنل واحد و ساده
          </p>
        </div>

        {/* Feature 3 */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark sm:col-span-2 lg:col-span-1">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
            <svg className="h-7 w-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
            صرفه‌جویی
          </h3>
          <p className="text-base text-body-color dark:text-dark-6">
            کاهش هزینه‌ها و افزایش کارایی با استفاده از ابزارهای هوشمند و یکپارچه
          </p>
        </div>
      </div>
    </div>
  );
}