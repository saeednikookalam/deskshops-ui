"use client";

import dynamic from "next/dynamic";

const BasalamPageContent = dynamic(() => import("./BasalamPageContent"), {
  ssr: false,
  loading: () => <div className="p-6">در حال بارگذاری...</div>,
});

export default function BasalamPage() {
  return <BasalamPageContent />;
}
