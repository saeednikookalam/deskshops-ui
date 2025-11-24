import { RocketIcon } from "./icons";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-calm-green to-dark-green py-16 md:py-20">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Heading */}
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            آماده شروعی؟
          </h2>

          {/* Description */}
          <p className="mb-8 text-base leading-relaxed text-white/90 md:text-lg">
            همین الان به دسک‌شاپ بپیوند و مدیریت فروشگاه‌هات رو ساده‌تر و
            مقرون‌به‌صرفه‌تر کن.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-white px-8 py-3 text-sm font-semibold text-calm-green shadow-1 transition-all hover:bg-warm-white hover:shadow-card sm:w-auto"
            >
              <RocketIcon className="h-5 w-5" />
              شروع رایگان
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80 md:text-sm">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              بدون نیاز به کارت اعتباری
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              راه‌اندازی در کمتر از 5 دقیقه
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              پشتیبانی 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white blur-3xl"></div>
        <div className="absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white blur-3xl"></div>
      </div>
    </section>
  );
}
