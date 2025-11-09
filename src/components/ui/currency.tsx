import { formatCurrency } from "@/lib/number-utils";

type CurrencyProps = {
  /**
   * مبلغ به ریال (از API می‌آید)
   */
  value: number;
  /**
   * آیا واحد "تومان" نمایش داده شود؟
   */
  showUnit?: boolean;
  /**
   * کلاس‌های اضافی برای استایل دهی
   */
  className?: string;
};

/**
 * کامپوننت نمایش مبلغ
 *
 * این کامپوننت مبلغ را از ریال به تومان تبدیل می‌کند و با کامای فارسی نمایش می‌دهد
 *
 * @example
 * ```tsx
 * // نمایش 10000 ریال به صورت "۱,۰۰۰ تومان"
 * <Currency value={10000} />
 *
 * // نمایش بدون واحد
 * <Currency value={10000} showUnit={false} />
 * ```
 */
export function Currency({ value, showUnit = true, className = "" }: CurrencyProps) {
  const formatted = formatCurrency(value);

  return (
    <span className={className}>
      {formatted}
      {showUnit && " تومان"}
    </span>
  );
}
