import { CheckIcon } from "./icons";

export function PricingComparison() {
  return (
    <section className="bg-warm-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-deep-black md:text-4xl lg:text-5xl">
              صرفه‌جویی واقعی
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-gray">
              تا 70% کمتر از پکیج‌های ثابت
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Traditional Packages */}
            <div className="rounded-2xl bg-white p-8 shadow-card">
              <div className="mb-6">
                <div className="mb-2 text-sm font-medium text-red">
                  پکیج‌های سنتی
                </div>
                <div className="text-3xl font-bold text-deep-black">
                  500,000
                  <span className="text-lg font-normal text-neutral-gray">
                    {" "}
                    تومان/ماه
                  </span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-neutral-gray">
                  <span className="mt-1 text-red">✗</span>
                  <span>پرداخت برای همه امکانات حتی اگر استفاده نکنی</span>
                </li>
                <li className="flex items-start gap-2 text-neutral-gray">
                  <span className="mt-1 text-red">✗</span>
                  <span>محدودیت در تعداد فروشگاه‌ها</span>
                </li>
                <li className="flex items-start gap-2 text-neutral-gray">
                  <span className="mt-1 text-red">✗</span>
                  <span>هزینه اضافی برای هر کانال جدید</span>
                </li>
                <li className="flex items-start gap-2 text-neutral-gray">
                  <span className="mt-1 text-red">✗</span>
                  <span>قرارداد بلندمدت الزامی</span>
                </li>
              </ul>
            </div>

            {/* Deskshops */}
            <div className="relative rounded-2xl bg-gradient-to-br from-calm-green to-dark-green p-8 shadow-3">
              {/* Popular Badge */}
              <div className="absolute left-6 top-0 -translate-y-1/2">
                <div className="rounded-full bg-yellow-dark px-4 py-1 text-sm font-bold text-white">
                  پیشنهاد ویژه
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 text-sm font-medium text-white/80">
                  دسک‌شاپ (مثال)
                </div>
                <div className="text-3xl font-bold text-white">
                  150,000
                  <span className="text-lg font-normal text-white/80">
                    {" "}
                    تومان/ماه
                  </span>
                </div>
                <div className="mt-2 text-sm font-bold text-yellow-light">
                  70% صرفه‌جویی!
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>فقط برای پلاگین‌هایی که استفاده می‌کنی پرداخت کن</span>
                </li>
                <li className="flex items-start gap-2 text-white">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>فروشگاه و کانال نامحدود</span>
                </li>
                <li className="flex items-start gap-2 text-white">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>فعال/غیرفعال کردن پلاگین‌ها در هر لحظه</span>
                </li>
                <li className="flex items-start gap-2 text-white">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>بدون قرارداد بلندمدت</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-gray">
              * قیمت‌ها تقریبی هستند و بر اساس استفاده از 3 پلاگین محاسبه شده‌اند.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
