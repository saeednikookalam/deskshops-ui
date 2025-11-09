"use client";

import { handleNumberInput, tomanToRial, formatWithPersianComma } from "@/lib/number-utils";
import { useState, useEffect } from "react";

type CurrencyInputProps = {
  /**
   * مقدار به ریال (برای ارسال به API)
   */
  value: number;
  /**
   * تابع callback برای تغییر مقدار (مقدار ریال را برمی‌گرداند)
   */
  onChange: (rialValue: number) => void;
  /**
   * placeholder
   */
  placeholder?: string;
  /**
   * آیا فیلد ضروری است؟
   */
  required?: boolean;
  /**
   * آیا فیلد غیرفعال است؟
   */
  disabled?: boolean;
  /**
   * کلاس‌های اضافی
   */
  className?: string;
  /**
   * نام فیلد
   */
  name?: string;
  /**
   * حداقل مقدار به تومان
   */
  min?: number;
  /**
   * حداکثر مقدار به تومان
   */
  max?: number;
};

/**
 * کامپوننت input برای وارد کردن مبلغ
 *
 * این کامپوننت مبلغ را به تومان از کاربر دریافت می‌کند
 * و به ریال به callback برمی‌گرداند
 *
 * @example
 * ```tsx
 * const [amount, setAmount] = useState(0);
 *
 * // کاربر عدد 1000 تومان وارد می‌کند
 * // به callback مقدار 10000 ریال ارسال می‌شود
 * <CurrencyInput
 *   value={amount}
 *   onChange={setAmount}
 *   placeholder="مبلغ را وارد کنید"
 *   min={10000} // حداقل 10000 تومان
 * />
 * ```
 */
export function CurrencyInput({
  value,
  onChange,
  placeholder = "مبلغ را وارد کنید",
  required = false,
  disabled = false,
  className = "",
  name,
  min,
  max,
}: CurrencyInputProps) {
  // مقدار نمایشی به تومان (بدون فرمت)
  const [displayValue, setDisplayValue] = useState("");
  // مقدار فرمت شده برای نمایش
  const [formattedValue, setFormattedValue] = useState("");
  // آیا input در حالت focus است؟
  const [isFocused, setIsFocused] = useState(false);

  // وقتی value از بیرون تغییر می‌کند، displayValue را آپدیت کن
  useEffect(() => {
    const tomanValue = Math.floor(value / 10);
    setDisplayValue(tomanValue === 0 ? "" : tomanValue.toString());
  }, [value]);

  // وقتی displayValue تغییر می‌کند، formattedValue را آپدیت کن
  useEffect(() => {
    if (displayValue === "") {
      setFormattedValue("");
    } else {
      setFormattedValue(formatWithPersianComma(parseInt(displayValue)));
    }
  }, [displayValue]);

  const handleChange = (inputValue: string) => {
    setDisplayValue(inputValue);

    // تبدیل به ریال و ارسال به callback
    if (inputValue === "") {
      onChange(0);
    } else {
      const tomanValue = parseInt(inputValue);
      const rialValue = tomanToRial(tomanValue);
      onChange(rialValue);
    }
  };

  const baseClassName =
    "w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary";

  return (
    <input
      type="text"
      inputMode="numeric"
      name={name}
      value={isFocused ? displayValue : formattedValue}
      onChange={(e) => handleNumberInput(e, handleChange)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`${baseClassName} ${className}`}
      min={min}
      max={max}
    />
  );
}
