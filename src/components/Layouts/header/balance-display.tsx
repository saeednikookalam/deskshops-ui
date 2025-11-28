"use client";

import { Currency } from "@/components/ui/currency";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";

export function BalanceDisplay() {
  const { balance, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <Link
      href="/panel/financial"
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-dark border border-stroke dark:border-dark-3 hover:border-primary dark:hover:border-primary transition-colors"
    >
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary flex-shrink-0"
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
      <span className="text-sm font-medium text-dark dark:text-white">
        <Currency value={balance || 0} />
      </span>
    </Link>
  );
}