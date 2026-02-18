"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const WebhooksPageContent = dynamic(
  () => import("./WebhooksPageContent"),
  {
    ssr: false,
    loading: () => (
      <div className="p-6">در حال بارگذاری...</div>
    ),
  }
);

export default function WebhooksPage() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shop_id");

  return <WebhooksPageContent shopId={shopId} />;
}
