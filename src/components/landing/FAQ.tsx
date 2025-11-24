"use client";

import { useState } from "react";
import { ChevronDownIcon } from "./icons";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "پرداخت چطوری انجام می‌شه؟",
      answer:
        "هر ماه فقط برای پلاگین‌هایی که فعال کردی پرداخت می‌کنی. می‌تونی در هر لحظه پلاگین‌ها رو فعال یا غیرفعال کنی و هزینه‌ت متناسب با همون محاسبه میشه.",
    },
    {
      question: "آیا محدودیتی برای تعداد فروشگاه‌ها وجود داره؟",
      answer:
        "نه، هیچ محدودیتی وجود نداره. می‌تونی تعداد نامحدودی فروشگاه و مارکت‌پلیس رو به دسک‌شاپ متصل کنی و همه رو از یک جا مدیریت کنی.",
    },
    {
      question: "چند پلاگین میتونم همزمان فعال کنم؟",
      answer:
        "محدودیتی نداریم! می‌تونی هر تعداد پلاگین که نیاز داری رو فعال کنی. البته توصیه می‌کنیم فقط پلاگین‌هایی که واقعاً استفاده می‌کنی رو فعال کنی تا هزینه‌ت کمتر بشه.",
    },
    {
      question: "آیا نیاز به دانش فنی دارم؟",
      answer:
        "نه اصلاً! رابط کاربری دسک‌شاپ خیلی ساده و کاربرپسند طراحی شده. همچنین تیم پشتیبانی ما 24/7 آماده کمک به شماست.",
    },
    {
      question: "آیا می‌تونم پلاگین‌ها رو تست کنم؟",
      answer:
        "بله! بعد از ثبت‌نام، می‌تونی هر پلاگینی رو برای یک دوره آزمایشی کوتاه تست کنی و ببینی برای کسب‌وکارت مناسبه یا نه.",
    },
    {
      question: "پشتیبانی چطوریه؟",
      answer:
        "تیم پشتیبانی ما 24/7 در دسترس هست. می‌تونی از طریق چت آنلاین، ایمیل یا تیکت با ما در ارتباط باشی. همچنین مستندات کامل و ویدیوهای آموزشی هم در اختیارت قرار داریم.",
    },
  ];

  return (
    <section className="bg-warm-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-deep-black md:text-3xl">
              سوالات متداول
            </h2>
            <p className="text-base text-neutral-gray md:text-lg">
              پاسخ سوالاتی که ممکنه داشته باشی
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[10px] bg-white shadow-1 transition-all hover:shadow-card"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-right transition-colors hover:bg-calm-green/5"
                >
                  <span className="text-base font-semibold text-deep-black">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 flex-shrink-0 text-calm-green transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="border-t border-gray-3 bg-light-gray p-5">
                    <p className="text-sm leading-relaxed text-neutral-gray">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-10 text-center">
            <p className="mb-3 text-sm text-neutral-gray">
              سوال دیگه‌ای داری؟
            </p>
            <a
              href="mailto:support@deskshops.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-calm-green transition-colors hover:text-dark-green"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              با پشتیبانی تماس بگیر
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
