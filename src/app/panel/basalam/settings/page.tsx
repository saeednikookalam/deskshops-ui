"use client";

import dynamic from "next/dynamic";

const SettingsPageContent = dynamic(() => import("./SettingsPageContent"), {
  ssr: false,
  loading: () => <div className="p-6">در حال بارگذاری...</div>,
});

export default function BasalamSettingsPage() {
  return <SettingsPageContent />;
}
