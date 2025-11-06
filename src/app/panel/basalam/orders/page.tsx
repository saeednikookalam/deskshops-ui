"use client";

import dynamic from "next/dynamic";

const OrdersPageContent = dynamic(() => import("./OrdersPageContent"), {
  ssr: false,
  loading: () => <div className="p-6">در حال بارگذاری...</div>,
});

export default function BasalamOrdersPage() {
  return <OrdersPageContent />;
}
