"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentsService } from "@/services/payments";
import { Button } from "@/components/ui-elements/button";
import { cn } from "@/lib/utils";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    authority?: string;
  } | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const authority = searchParams.get("Authority");
      const status = searchParams.get("Status");

      if (!authority || !status) {
        setResult({
          success: false,
          message: "پارامترهای کال‌بک نامعتبر است"
        });
        setIsProcessing(false);
        return;
      }

      try {
        await paymentsService.handleCallback({
          Authority: authority,
          Status: status
        });

        setResult({
          success: status === "OK",
          message: status === "OK"
            ? "پرداخت شما با موفقیت انجام شد و به موجودی حساب شما اضافه شد."
            : "پرداخت ناموفق بود. لطفاً مجدداً تلاش کنید.",
          authority: authority
        });
      } catch (error) {
        console.error("Callback error:", error);
        setResult({
          success: false,
          message: "خطا در پردازش کال‌بک پرداخت"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams]);

  const handleGoToFinancial = () => {
    router.push("/panel/financial");
  };

  const handleGoToDashboard = () => {
    router.push("/panel");
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-2 dark:bg-gray-dark">
        <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
            در حال پردازش پرداخت...
          </h2>
          <p className="text-body-color dark:text-dark-6">
            لطفاً صبر کنید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-2 dark:bg-gray-dark">
      <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card text-center max-w-md w-full mx-4">
        <div className="mb-6">
          <div
            className={cn(
              "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
              result?.success
                ? "bg-[#219653]/[0.08]"
                : "bg-[#D34053]/[0.08]"
            )}
          >
            {result?.success ? (
              <svg
                className="w-8 h-8 text-[#219653]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-[#D34053]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>

          <h2
            className={cn(
              "text-2xl font-bold mb-2",
              result?.success
                ? "text-[#219653]"
                : "text-[#D34053]"
            )}
          >
            {result?.success ? "پرداخت موفق" : "پرداخت ناموفق"}
          </h2>

          <p className="text-body-color dark:text-dark-6 mb-6">
            {result?.message}
          </p>

          {result?.success && result?.authority && (
            <div className="bg-gray-2 dark:bg-dark-2 rounded-lg p-4 mb-6">
              <p className="text-sm text-body-color dark:text-dark-6 mb-1">
                شماره تراکنش
              </p>
              <p className="text-base font-medium text-dark dark:text-white font-mono">
                {result.authority}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button
            label="بازگشت به بخش مالی"
            variant="primary"
            shape="rounded"
            onClick={handleGoToFinancial}
            className="w-full"
          />

          <Button
            label="بازگشت به داشبورد"
            variant="outlineDark"
            shape="rounded"
            onClick={handleGoToDashboard}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-2 dark:bg-gray-dark">
        <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
            در حال بارگذاری...
          </h2>
        </div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
