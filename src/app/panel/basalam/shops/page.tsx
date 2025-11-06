"use client";

import dynamic from "next/dynamic";

const ShopsPageContent = dynamic(() => import("./ShopsPageContent"), {
  ssr: false,
  loading: () => <div className="p-6">در حال بارگذاری...</div>,
});

export default function BasalamShopsPage() {
  return <ShopsPageContent />;
}
