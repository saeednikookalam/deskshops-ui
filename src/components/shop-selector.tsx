"use client";

import { useShop, type Shop } from "@/contexts/shop-context";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/dropdown";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ShopSelectorProps {
  showAllOption?: boolean;
  className?: string;
}

export function ShopSelector({ showAllOption = true, className }: ShopSelectorProps) {
  const { shops, selectedShop, selectShop, isLoading } = useShop();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectShop = useCallback((shop: Shop | 'all') => {
    selectShop(shop);
    setIsOpen(false);
  }, [selectShop]);

  const getDisplayLabel = useCallback(() => {
    if (isLoading) {
      return "درحال بارگذاری...";
    }
    if (selectedShop === 'all') {
      return "همه فروشگاه‌ها";
    }
    if (selectedShop) {
      return selectedShop.title;
    }
    return "بدون فروشگاه";
  }, [selectedShop, isLoading]);

  return (
    <div className={cn("flex items-center", className)}>
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownTrigger
          className={cn(
            "flex items-center gap-2 rounded-lg border border-stroke bg-white px-3 py-2",
            "hover:bg-gray-1 dark:border-stroke-dark dark:bg-gray-dark dark:hover:bg-black",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "transition-colors duration-200"
          )}
          aria-label="انتخاب فروشگاه"
        >
          <svg
            className="h-5 w-5 text-gray-5 dark:text-gray-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="text-sm font-medium text-gray-dark dark:text-white">
            {getDisplayLabel()}
          </span>
          <svg
            className={cn(
              "h-4 w-4 text-gray-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </DropdownTrigger>

        <DropdownContent align="end" className="w-56">
          <div className="rounded-lg border border-stroke bg-white p-1 dark:border-stroke-dark dark:bg-gray-dark">
            {/* All Shops Option */}
            {showAllOption && (
              <button
                onClick={() => handleSelectShop('all')}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-right",
                  "hover:bg-gray-1 dark:hover:bg-black",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "transition-colors duration-150",
                  selectedShop === 'all' && "bg-gray-2 dark:bg-gray-4"
                )}
              >
                <svg
                  className="h-5 w-5 text-gray-5 dark:text-gray-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-sm text-gray-dark dark:text-white">
                  همه فروشگاه‌ها
                </span>
              </button>
            )}

            {/* Shop List */}
            {shops.map((shop) => (
              <button
                key={shop.id}
                onClick={() => handleSelectShop(shop)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-right",
                  "hover:bg-gray-1 dark:hover:bg-black",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "transition-colors duration-150",
                  selectedShop?.id === shop.id && "bg-gray-2 dark:bg-gray-4"
                )}
              >
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={shop.title}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {shop.title.charAt(0)}
                  </div>
                )}
                <span className="text-sm text-gray-dark dark:text-white">
                  {shop.title}
                </span>
              </button>
            ))}

            {/* Empty State */}
            {!isLoading && shops.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-gray-4 dark:text-gray-5">
                فروشگاهی متصل نیست
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center px-3 py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
