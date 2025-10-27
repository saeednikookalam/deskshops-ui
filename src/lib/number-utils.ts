/**
 * Utilities for handling number inputs in Persian/English
 *
 * Example usage for number-only inputs:
 * ```tsx
 * import { handleNumberInput } from '@/lib/number-utils';
 *
 * const [amount, setAmount] = useState("");
 *
 * <input
 *   type="text"
 *   inputMode="numeric"
 *   value={amount}
 *   onChange={(e) => handleNumberInput(e, setAmount)}
 * />
 * ```
 *
 * Example with custom logic:
 * ```tsx
 * <input
 *   type="text"
 *   value={otpCode}
 *   onChange={(e) => handleNumberInput(e, (value) => setOtpCode(value.slice(0, 4)))}
 * />
 * ```
 */

/**
 * تبدیل اعداد فارسی و عربی به انگلیسی
 */
export function convertPersianToEnglish(str: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let result = str;

  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
  }

  return result;
}

/**
 * فقط اعداد رو نگه میداره و بقیه کاراکترها رو حذف میکنه
 */
export function onlyNumbers(str: string): string {
  const converted = convertPersianToEnglish(str);
  return converted.replace(/[^\d]/g, '');
}

/**
 * فقط اعداد و نقطه اعشار رو نگه میداره
 */
export function onlyNumbersWithDecimal(str: string): string {
  const converted = convertPersianToEnglish(str);
  return converted.replace(/[^\d.]/g, '');
}

/**
 * Handler برای input های عددی که فقط عدد قبول میکنن
 */
export function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>, callback: (value: string) => void) {
  const value = onlyNumbers(e.target.value);
  e.target.value = value;
  callback(value);
}

/**
 * Handler برای input های عددی که اعشار هم قبول میکنن
 */
export function handleDecimalInput(e: React.ChangeEvent<HTMLInputElement>, callback: (value: string) => void) {
  const value = onlyNumbersWithDecimal(e.target.value);
  e.target.value = value;
  callback(value);
}
