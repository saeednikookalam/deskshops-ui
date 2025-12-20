"use client";

import dynamic from "next/dynamic";

const MixinPageContent = dynamic(() => import("./MixinPageContent"), {
  ssr: false,
  loading: () => <div className="p-6">در حال بارگذاری...</div>,
});

export default function MixinPage() {
  return <MixinPageContent />;
}
