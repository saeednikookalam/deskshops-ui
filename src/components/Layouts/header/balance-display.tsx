"use client";

import { useState, useEffect } from "react";
import { paymentsService } from "@/services/payments";
import { Currency } from "@/components/ui/currency";
import Link from "next/link";

export function BalanceDisplay() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await paymentsService.getBalance();
        setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Link
        href="/panel/financial"
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-dark border border-stroke dark:border-dark-3 hover:border-red transition-colors"
      >
        <svg
          className="w-5 h-5 text-red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span className="text-sm text-red">خطا</span>
      </Link>
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