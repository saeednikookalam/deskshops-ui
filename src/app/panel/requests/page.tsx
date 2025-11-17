"use client";

import dynamic from "next/dynamic";

const RequestsPageContent = dynamic(() => import("./RequestsPageContent"), {
  ssr: false,
  loading: () => <div className="p-6">در حال بارگذاری...</div>,
});

export default function RequestsPage() {
  return <RequestsPageContent />;
}
