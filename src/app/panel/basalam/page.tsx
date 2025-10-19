"use client";

import dynamic from "next/dynamic";

// این صفحه رو dynamic می‌کنیم تا از SSR خارج بشه و useSearchParams مشکل نداشته باشه
const BasalamPageContent = dynamic(() => import("./BasalamPageContent"), {
  ssr: false,
  loading: () => <div className="p-6">در حال بارگذاری...</div>,
});

export default function BasalamPage() {
  return <BasalamPageContent />;
}
