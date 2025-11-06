"use client";

import dynamic from "next/dynamic";

const ProductsPageContent = dynamic(() => import("./ProductsPageContent"), {
  ssr: false,
  loading: () => <div className="p-6">در حال بارگذاری...</div>,
});

export default function BasalamProductsPage() {
  return <ProductsPageContent />;
}
