import { useEffect, useRef } from 'react';

/**
 * Custom hook که مطمئن میشه effect فقط یک بار در زمان mount اجرا میشه
 * این hook مشکل دوبار کال شدن در React StrictMode یا تغییرات dependency رو حل میکنه
 *
 * @param effect - تابعی که باید یک بار اجرا بشه
 * @param deps - dependencies اختیاری (اگر نیاز داری effect رو فقط وقتی که dependency خاصی تغییر کرد اجرا کنی)
 *
 * @example
 * ```tsx
 * // استفاده ساده - فقط یک بار در mount
 * useOnce(() => {
 *   console.log('این فقط یک بار اجرا میشه');
 * });
 *
 * // با dependency - فقط وقتی userId تغییر کنه و فقط یک بار برای هر مقدار
 * useOnce(() => {
 *   fetchUserData(userId);
 * }, [userId]);
 * ```
 */
export function useOnce(effect: () => void | (() => void), deps?: React.DependencyList) {
  const hasRun = useRef(false);
  const cleanupRef = useRef<void | (() => void) | undefined>(undefined);
  const effectDeps = deps === undefined ? [] : deps;

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      cleanupRef.current = effect();
    }

    return () => {
      if (cleanupRef.current && typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectDeps);

  // Reset hasRun when dependencies change
  useEffect(() => {
    if (deps && deps.length > 0) {
      hasRun.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectDeps);
}

/**
 * Custom hook برای بارگذاری داده در زمان mount که فقط یک بار اجرا میشه
 * مخصوص async functions
 *
 * @param asyncEffect - تابع async که باید یک بار اجرا بشه
 * @param deps - dependencies اختیاری
 *
 * @example
 * ```tsx
 * useOnceAsync(async () => {
 *   const data = await fetchData();
 *   setData(data);
 * });
 * ```
 */
export function useOnceAsync(asyncEffect: () => Promise<void>, deps?: React.DependencyList) {
  const hasRun = useRef(false);
  const effectDeps = deps === undefined ? [] : deps;

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      asyncEffect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectDeps);

  // Reset hasRun when dependencies change
  useEffect(() => {
    if (deps && deps.length > 0) {
      hasRun.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectDeps);
}
