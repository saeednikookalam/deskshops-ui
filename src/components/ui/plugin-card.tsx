"use client";

import { cn } from "@/lib/utils";
import type { JSX, SVGProps } from "react";
import Image from "next/image";

type PluginStatus = 'active' | 'inactive' | 'disabled';

type PropsType = {
  name: string;
  description?: string;
  status: PluginStatus;
  userCount?: number;
  version?: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  hasSubscription?: boolean;
  logoUrl?: string;
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  onCardClick?: () => void;
};

const defaultIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <rect x="9" y="9" width="6" height="6"/>
  </svg>
);

export function PluginCard({
  name,
  description,
  status,
  userCount,
  version,
  monthlyPrice,
  yearlyPrice,
  hasSubscription = false,
  logoUrl,
  icon: Icon = defaultIcon,
  onCardClick
}: PropsType) {
  const formatPrice = (price: string) => {
    // Convert Rial to Toman by dividing by 10
    const tomanPrice = parseFloat(price) / 10;
    return tomanPrice.toLocaleString('fa-IR') + ' تومان';
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark transition-all hover:shadow-lg h-full flex flex-col cursor-pointer relative",
        hasSubscription && "ring-1 ring-green/30"
      )}
      data-status={status}
      onClick={onCardClick}
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">
          {logoUrl ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-2 dark:bg-dark-2 flex items-center justify-center">
              <Image
                src={logoUrl}
                alt={name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="text-primary w-8 h-8 flex items-center justify-center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg></div>';
                  }
                }}
              />
            </div>
          ) : (
            <div className="text-primary">
              <Icon className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-dark dark:text-white truncate">{name}</h3>
        </div>
        {hasSubscription && (
          <div className="flex-shrink-0 bg-green text-white px-2 py-1 rounded-full text-xs font-medium">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              فعال
            </div>
          </div>
        )}
      </div>

      {/* Description - Reduced Height */}
      <div className="mb-3 h-12 flex items-start">
        <p className="text-base text-body-color dark:text-dark-6 leading-relaxed line-clamp-2">
          {description ? truncateDescription(description, 100) : 'توضیحاتی ارائه نشده است.'}
        </p>
      </div>

      {/* Pricing - Adjusted Height */}
      <div className="mb-3 flex items-center">
        {hasSubscription ? (
          <div className="w-full p-2 bg-green-light-6 dark:bg-green/10 rounded-lg border border-green/20">
            <div className="flex items-center justify-center text-green">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm">اشتراک فعال</span>
            </div>
          </div>
        ) : (
          <div className="w-full p-2 bg-gray-2 dark:bg-dark-2 rounded-lg">
            <div className="flex justify-between items-center text-xs text-body-color dark:text-dark-6">
              <div className="text-center flex-1">
                <div>ماهانه</div>
                <div className="font-medium text-dark dark:text-white">{monthlyPrice ? formatPrice(monthlyPrice) : '-'}</div>
              </div>
              <div className="w-px h-8 bg-stroke dark:bg-dark-3 mx-2"></div>
              <div className="text-center flex-1">
                <div>سالانه</div>
                <div className="font-medium text-dark dark:text-white">{yearlyPrice ? formatPrice(yearlyPrice) : '-'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats: Active Installs and Version - Fixed Height */}
      <div className="flex items-center justify-between text-sm text-body-color dark:text-dark-6 h-5">
        <div>
          <span>نصب فعال: {userCount !== undefined ? userCount.toLocaleString('fa-IR') : '0'}</span>
        </div>
        <div>
          نسخه {version || 'نامشخص'}
        </div>
      </div>

    </div>
  );
}
