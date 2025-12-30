"use client";

interface FileGuideProps {
  operationType: 'update' | 'create';
}

export function FileGuide({ operationType }: FileGuideProps) {
  if (operationType === 'create') {
    return (
      <div className="space-y-6">
        {/* Intro */}
        <div>
          <p className="text-sm text-body-color dark:text-dark-6">
            برای ایجاد محصولات جدید، فایل CSV، Excel یا JSON باید شامل فیلدهای زیر باشد:
          </p>
        </div>

        {/* Required Fields Table */}
        <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
          <div className="bg-gray-2 dark:bg-dark-2 px-4 py-2 border-b border-stroke dark:border-dark-3">
            <p className="text-sm font-medium text-dark dark:text-white">فیلدهای الزامی</p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <th className="text-right py-2 text-dark dark:text-white">فیلد</th>
                  <th className="text-right py-2 text-dark dark:text-white">نوع</th>
                  <th className="text-right py-2 text-dark dark:text-white">توضیحات</th>
                </tr>
              </thead>
              <tbody className="text-body-color dark:text-dark-6">
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">shop_id</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">شناسه فروشگاه</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">name</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">نام محصول (حداقل 3 کاراکتر)</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">category_id</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">شناسه دسته‌بندی (عدد مثبت)</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">preparation_days</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">روزهای آماده‌سازی (عدد {'>='} 0)</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">package_weight</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">وزن بسته‌بندی به گرم (عدد {'>='} 0)</td>
                </tr>
                <tr>
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">photo_urls</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">آدرس تصاویر (جدا شده با کامه)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional Fields Table */}
        <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
          <div className="bg-gray-2 dark:bg-dark-2 px-4 py-2 border-b border-stroke dark:border-dark-3">
            <p className="text-sm font-medium text-dark dark:text-white">فیلدهای اختیاری</p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <th className="text-right py-2 text-dark dark:text-white">فیلد</th>
                  <th className="text-right py-2 text-dark dark:text-white">نوع</th>
                  <th className="text-right py-2 text-dark dark:text-white">توضیحات</th>
                </tr>
              </thead>
              <tbody className="text-body-color dark:text-dark-6">
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">status</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">&quot;active&quot; یا &quot;inactive&quot; (پیش‌فرض: active)</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">sku</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">کد محصول</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">brief</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">خلاصه توضیحات</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">description</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">توضیحات کامل محصول</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">primary_price</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">قیمت اصلی (ریال، عدد {'>='} 0)</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">stock</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">موجودی (عدد {'>='} 0)</td>
                </tr>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">weight</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">وزن محصول به گرم (عدد {'>='} 0)</td>
                </tr>
                <tr>
                  <td dir="ltr" className="py-2 font-mono text-primary text-right">keywords</td>
                  <td className="py-2 text-right">string</td>
                  <td className="py-2 text-right">کلمات کلیدی (جدا شده با کامه)</td>
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
                <li>همه فیلدهای الزامی باید وجود داشته باشند</li>
                <li>فیلدهای عددی باید عدد باشند و {'>='} 0</li>
                <li>photo_urls باید حداقل یک آدرس تصویر داشته باشد</li>
                <li>status فقط &quot;active&quot; یا &quot;inactive&quot;</li>
                <li><strong>نباید</strong> فیلد shop_product_id داشته باشد (فقط برای به‌روزرسانی)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Update mode
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <p className="text-sm text-body-color dark:text-dark-6">
          برای به‌روزرسانی محصولات موجود، فایل CSV، Excel یا JSON باید شامل فیلدهای زیر باشد:
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
    </div>
  );
}
