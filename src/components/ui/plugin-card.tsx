"use client";

import { cn } from "@/lib/utils";
import { Currency } from "@/components/ui/currency";
import type { JSX, SVGProps } from "react";
import Image from "next/image";
import { useState } from "react";

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
  const [imageError, setImageError] = useState(false);

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // پلاگین inactive که خریداری نشده
  const isInactiveAndNotPurchased = status === 'inactive' && !hasSubscription;

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark transition-all hover:shadow-lg h-full flex flex-col cursor-pointer relative",
        hasSubscription && "ring-1 ring-green/30",
        isInactiveAndNotPurchased && "opacity-70"
      )}
      data-status={status}
      onClick={onCardClick}
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">
          {logoUrl && !imageError ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-2 dark:bg-dark-2 flex items-center justify-center">
              <Image
                src={logoUrl}
                alt={name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
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
        {isInactiveAndNotPurchased && (
          <div className="flex-shrink-0 bg-yellow-dark text-white px-2 py-1 rounded-full text-xs font-medium">
            به زودی
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
        ) : isInactiveAndNotPurchased ? (
          <div className="w-full p-3 bg-yellow-light-4 dark:bg-yellow-dark/10 rounded-lg border border-yellow-dark/20">
            <div className="flex items-center justify-center text-yellow-dark">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm">به زودی</span>
            </div>
          </div>
        ) : (
          <div className="w-full p-2 bg-gray-2 dark:bg-dark-2 rounded-lg">
            <div className="flex justify-between items-center text-xs text-body-color dark:text-dark-6">
              <div className="text-center flex-1">
                <div>ماهانه</div>
                <div className="font-medium text-dark dark:text-white">
                  {monthlyPrice ? <Currency value={parseFloat(monthlyPrice)} /> : '-'}
                </div>
              </div>
              <div className="w-px h-8 bg-stroke dark:bg-dark-3 mx-2"></div>
              <div className="text-center flex-1">
                <div>سالانه</div>
                <div className="font-medium text-dark dark:text-white">
                  {yearlyPrice ? <Currency value={parseFloat(yearlyPrice)} /> : '-'}
                </div>
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
