"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BasalamPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/panel/basalam/shops");
  }, [router]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        <p className="text-body-color dark:text-dark-6">در حال انتقال...</p>
      </div>
    </div>
  );
}
