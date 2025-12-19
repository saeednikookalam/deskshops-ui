"use client";

export function FileGuide() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <p className="text-sm text-body-color dark:text-dark-6">
          فایل‌های CSV، Excel و JSON باید شامل فیلدهای زیر باشند. تمام فرمت‌ها از عناوین یکسانی استفاده می‌کنند.
        </p>
      </div>

      {/* Fields Table */}
      <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
        <div className="bg-gray-2 dark:bg-dark-2 px-4 py-2 border-b border-stroke dark:border-dark-3">
          <p className="text-sm font-medium text-dark dark:text-white">فیلدهای قابل استفاده</p>
        </div>
        <div className="p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="text-right py-2 text-dark dark:text-white">فیلد</th>
                <th className="text-right py-2 text-dark dark:text-white">الزامی</th>
                <th className="text-right py-2 text-dark dark:text-white">نوع</th>
                <th className="text-right py-2 text-dark dark:text-white">توضیحات</th>
              </tr>
            </thead>
            <tbody className="text-body-color dark:text-dark-6">
              <tr className="border-b border-stroke dark:border-dark-3">
                <td dir="ltr" className="py-2 font-mono text-primary text-right">shop_id</td>
                <td className="py-2 text-right"><span className="text-red-500">✓</span></td>
                <td className="py-2 text-right">string</td>
                <td className="py-2 text-right">شناسه فروشگاه</td>
              </tr>
              <tr className="border-b border-stroke dark:border-dark-3">
                <td dir="ltr" className="py-2 font-mono text-primary text-right">shop_product_id</td>
                <td className="py-2 text-right"><span className="text-red-500">✓</span></td>
                <td className="py-2 text-right">string</td>
                <td className="py-2 text-right">شناسه یکتای محصول در سیستم شما</td>
              </tr>
              <tr className="border-b border-stroke dark:border-dark-3">
                <td dir="ltr" className="py-2 font-mono text-primary text-right">name</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right">string</td>
                <td className="py-2 text-right">نام محصول</td>
              </tr>
              <tr className="border-b border-stroke dark:border-dark-3">
                <td dir="ltr" className="py-2 font-mono text-primary text-right">price</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right">string</td>
                <td className="py-2 text-right">قیمت فروش (عدد، ریال)</td>
              </tr>
              <tr className="border-b border-stroke dark:border-dark-3">
                <td dir="ltr" className="py-2 font-mono text-primary text-right">primary_price</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right">string</td>
                <td className="py-2 text-right">قیمت قبل از تخفیف (عدد، ریال)</td>
              </tr>
              <tr className="border-b border-stroke dark:border-dark-3">
                <td dir="ltr" className="py-2 font-mono text-primary text-right">stock</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right">string</td>
                <td className="py-2 text-right">موجودی انبار (عدد)</td>
              </tr>
              <tr className="border-b border-stroke dark:border-dark-3">
                <td dir="ltr" className="py-2 font-mono text-primary text-right">status</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right">string</td>
                <td className="py-2 text-right">&quot;active&quot; یا &quot;inactive&quot;</td>
              </tr>
              <tr>
                <td dir="ltr" className="py-2 font-mono text-primary text-right">preparation_days</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right">string</td>
                <td className="py-2 text-right">مدت آماده‌سازی (عدد، روز)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation Rules */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-600 dark:text-blue-500">
            <p className="font-semibold mb-2">قوانین اعتبارسنجی:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>shop_id</strong> و <strong>shop_product_id</strong> الزامی هستند</li>
              <li><strong>حداقل یکی</strong> از فیلدهای دیگر (name, status, stock, price, primary_price, preparation_days) باید ارسال شود</li>
              <li>فیلدهای عددی (stock, price, primary_price, preparation_days) باید عدد باشند و نمی‌توانند منفی باشند</li>
              <li>status فقط می‌تواند &quot;active&quot; یا &quot;inactive&quot; باشد</li>
              <li>فیلدهای خالی یا null نادیده گرفته می‌شوند</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          نکات مهم
        </h3>

        {/* Dual Language Headers */}
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 dark:border-yellow-500/30 dark:bg-yellow-500/10">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-yellow-600 dark:text-yellow-500">
              <p className="font-medium mb-1">عناوین دوزبانه:</p>
              <p>
                می‌توانید عناوین را به فارسی و انگلیسی بنویسید، مثل{" "}
                <code className="bg-white dark:bg-dark px-1.5 py-0.5 rounded text-xs">shop_id - شناسه فروشگاه</code>.
                سیستم به طور خودکار قسمت فارسی را حذف می‌کند.
              </p>
            </div>
          </div>
        </div>

        {/* Price Format */}
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 dark:border-red-500/30 dark:bg-red-500/10">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-sm text-red-600 dark:text-red-500">
              <p className="font-medium mb-1">فرمت قیمت‌ها:</p>
              <p>
                قیمت‌ها باید به <strong>ریال</strong> و <strong>بدون کاما یا نقطه</strong> باشند.
                <br />
                ✅ درست: <code className="font-mono">15000000</code>
                <br />
                ❌ غلط: <code className="font-mono">15,000,000</code> یا <code className="font-mono">15.000.000</code>
              </p>
            </div>
          </div>
        </div>

        {/* File Limits */}
        <div className="rounded-lg border border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-2 p-4">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-body-color dark:text-dark-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-body-color dark:text-dark-6">
              <p className="font-medium mb-1">محدودیت‌ها:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>حداکثر حجم فایل: <strong>10 مگابایت</strong></li>
                <li>فرمت‌های پشتیبانی شده: CSV (.csv), Excel (.xlsx, .xls), JSON (.json)</li>
                <li>ردیف‌های خالی به طور خودکار نادیده گرفته می‌شوند</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
