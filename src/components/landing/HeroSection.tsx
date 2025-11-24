"use client";

import Link from "next/link";
import { RocketIcon } from "./icons";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-calm-green/5 via-green-light-7 to-warm-white py-20 md:py-28 lg:py-36">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Animated Badge */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-calm-green/20 to-calm-green/10 px-5 py-2.5 text-sm font-medium text-calm-green shadow-sm ring-1 ring-calm-green/20 backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4 animate-pulse" />
              <span className="bg-gradient-to-r from-calm-green to-dark-green bg-clip-text text-transparent">
                راه‌حل هوشمند مدیریت فروشگاه‌های آنلاین
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center">
            {/* Main Heading with Animation */}
            <h1 className="mb-6 text-3xl font-bold leading-tight text-deep-black md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-l from-calm-green via-calm-green to-dark-green bg-clip-text text-transparent">
                با هزینه کمتری
              </span>{" "}
              <span>همه چیز رو یکجا مدیریت کن</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-neutral-gray md:text-xl">
              فقط برای پلاگین‌هایی که نیاز داری پرداخت کن و چندین فروشگاه رو از یک پنل مدیریت کن.
            </p>
          </div>

          {/* Visual Dashboard Mockup */}
          <div className="relative mt-12">
            <div className="relative mx-auto max-w-4xl">
              {/* Floating Cards */}
              <div className="absolute -right-4 top-8 hidden animate-topbottom md:block">
                <div className="rounded-lg bg-white p-4 shadow-3 ring-1 ring-gray-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-calm-green"></div>
                    <div className="text-xs font-semibold text-deep-black">
                      موجودی همگام شد
                    </div>
                  </div>
                  <div className="text-xs text-neutral-gray">باسلام ↔ ووکامرس</div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-8 hidden animate-bottomtop md:block">
                <div className="rounded-lg bg-white p-4 shadow-3 ring-1 ring-gray-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-light-1"></div>
                    <div className="text-xs font-semibold text-deep-black">
                      سفارش جدید
                    </div>
                  </div>
                  <div className="text-xs text-neutral-gray">+3 سفارش امروز</div>
                </div>
              </div>

              {/* Main Dashboard Mockup */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-3 ring-1 ring-gray-3">
                <div className="border-b border-gray-3 bg-gradient-to-r from-warm-white to-green-light-7 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red/50"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-dark/50"></div>
                      <div className="h-3 w-3 rounded-full bg-calm-green/50"></div>
                    </div>
                    <div className="text-sm font-semibold text-deep-black">
                      پنل مدیریت دسک‌شاپ
                    </div>
                  </div>
                </div>
                <div className="space-y-3 p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-1/3 animate-pulse rounded-lg bg-gradient-to-r from-calm-green/20 to-calm-green/5"></div>
                    <div className="h-12 w-1/3 animate-pulse rounded-lg bg-gradient-to-r from-green-light-1/20 to-green-light-1/5 [animation-delay:200ms]"></div>
                    <div className="h-12 w-1/3 animate-pulse rounded-lg bg-gradient-to-r from-blue/20 to-blue/5 [animation-delay:400ms]"></div>
                  </div>
                  <div className="h-32 animate-pulse rounded-lg bg-gradient-to-br from-calm-green/10 to-green-light-7 [animation-delay:600ms]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-gradient-to-r from-calm-green to-dark-green px-8 py-3 text-base font-semibold text-white shadow-1 transition-all hover:shadow-card hover:scale-105"
            >
              <RocketIcon className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
              <span>شروع کن</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Background Decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Watermark Platform Logos - Right Side */}
        <div className="absolute right-[5%] top-[15%] rotate-12 text-6xl font-bold text-calm-green opacity-[0.15] md:text-7xl">
          باسلام
        </div>
        <div className="absolute right-[10%] top-[45%] -rotate-6 text-5xl font-bold text-calm-green opacity-[0.15] md:text-6xl">
          دیجی‌کالا
        </div>
        <div className="absolute right-[8%] top-[75%] rotate-3 text-4xl font-bold text-calm-green opacity-[0.15] md:text-5xl">
          دیوار
        </div>

        {/* Watermark Platform Logos - Left Side */}
        <div className="absolute left-[5%] top-[20%] -rotate-12 text-5xl font-bold text-calm-green opacity-[0.15] md:text-6xl">
          ووکامرس
        </div>
        <div className="absolute left-[10%] top-[55%] rotate-6 text-6xl font-bold text-calm-green opacity-[0.15] md:text-7xl">
          اینستاگرام
        </div>
        <div className="absolute left-[8%] top-[80%] -rotate-3 text-4xl font-bold text-calm-green opacity-[0.15] md:text-5xl">
          شاپیفای
        </div>

        {/* Watermark Platform Logos - Center */}
        <div className="absolute left-[35%] top-[10%] rotate-6 text-3xl font-bold text-calm-green opacity-[0.12] md:text-4xl">
          ترب
        </div>
        <div className="absolute right-[30%] top-[85%] -rotate-6 text-3xl font-bold text-calm-green opacity-[0.12] md:text-4xl">
          اسنپ‌فود
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute -right-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-calm-green/20 blur-3xl"></div>
        <div className="absolute -left-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-green-light-1/20 blur-3xl [animation-delay:1s]"></div>
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-calm-green/10 blur-3xl [animation-delay:2s]"></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #2E7D32 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Floating Shapes */}
        <div className="absolute right-1/4 top-20 h-4 w-4 animate-ping rounded-full bg-calm-green/30 [animation-delay:3s]"></div>
        <div className="absolute left-1/3 top-1/3 h-3 w-3 animate-ping rounded-full bg-green-light-1/30 [animation-delay:4s]"></div>
        <div className="absolute bottom-1/4 right-1/3 h-5 w-5 animate-ping rounded-full bg-calm-green/20 [animation-delay:5s]"></div>
      </div>
    </section>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}
