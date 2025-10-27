"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { paymentsService, type CreditItem } from "@/services/payments";
import { Button } from "@/components/ui-elements/button";
import { AddCreditModal } from "@/components/ui/add-credit-modal";
import { StatusModal } from "@/components/ui/status-modal";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import "dayjs/locale/fa";
import relativeTime from "dayjs/plugin/relativeTime";

// Configure dayjs for Persian
dayjs.locale("fa");
dayjs.extend(relativeTime);

function FinancialPageContent() {
  const searchParams = useSearchParams();
  const [balance, setBalance] = useState<number>(0);
  const [credits, setCredits] = useState<CreditItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [, setOffset] = useState(0);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentResultModal, setPaymentResultModal] = useState<{
    show: boolean;
    success: boolean;
    message: string;
    authority?: string;
  }>({ show: false, success: false, message: "" });

  const limit = 20;

  // Load balance
  const loadBalance = useCallback(async () => {
    try {
      const data = await paymentsService.getBalance();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error loading balance:", error);
      toast.error("خطا در بارگذاری موجودی");
    }
  }, []);

  // Load credits
  const loadCredits = useCallback(async (reset = false) => {
    try {
      setIsLoadingCredits(true);
      // Use functional update to get current offset without dependency
      setOffset(currentOffset => {
        const offsetToUse = reset ? 0 : currentOffset;

        paymentsService.getCredits(limit, offsetToUse)
          .then(data => {
            const { credits, has_more } = data;
            if (reset) {
              setCredits(credits);
            } else {
              setCredits(prev => [...prev, ...credits]);
            }
            setHasMore(has_more);
            setIsLoadingCredits(false);
          })
          .catch(error => {
            console.error("Error loading credits:", error);
            toast.error("خطا در بارگذاری لیست تراکنش‌ها");
            setIsLoadingCredits(false);
          });

        return reset ? limit : currentOffset + limit;
      });
    } catch (error) {
      console.error("Error loading credits:", error);
      toast.error("خطا در بارگذاری لیست تراکنش‌ها");
      setIsLoadingCredits(false);
    }
  }, []);

  // Handle payment form submission
  const handlePaymentSubmit = async (amount: number) => {
    setIsProcessingPayment(true);

    try {
      const data = await paymentsService.createPayment({
        amount: amount,
      });

      if (data.payment_url) {
        // Redirect to payment gateway
        window.location.href = data.payment_url;
      } else {
        toast.error("خطا در ایجاد درخواست پرداخت");
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      toast.error("خطا در ایجاد درخواست پرداخت");
      setIsProcessingPayment(false);
    }
  };

  // Load more credits
  const handleLoadMore = () => {
    loadCredits(false);
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  };

  // Check for payment callback result
  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    const authority = searchParams.get("authority");

    if (status || message) {
      setPaymentResultModal({
        show: true,
        success: status === "success",
        message: message
          ? decodeURIComponent(message)
          : (status === "success" ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"),
        authority: authority || undefined
      });

      // Clear URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      url.searchParams.delete("message");
      url.searchParams.delete("authority");
      window.history.replaceState({}, "", url.toString());

      // Reload balance and credits after payment (only on success)
      if (status === "success") {
        loadBalance();
        loadCredits(true);
      }
    }
  }, [searchParams, loadBalance, loadCredits]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadBalance(),
        loadCredits(true)
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [loadBalance, loadCredits]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7.5">
          <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-3 dark:bg-dark-3 rounded"></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            <div className="animate-pulse space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-3 dark:bg-dark-3 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Payment Result Modal */}
      <StatusModal
        isOpen={paymentResultModal.show}
        status={paymentResultModal.success ? "success" : "error"}
        title={paymentResultModal.success ? "پرداخت موفق" : "پرداخت ناموفق"}
        message={
          paymentResultModal.message +
          (paymentResultModal.success && paymentResultModal.authority
            ? `\n\nشماره تراکنش: ${paymentResultModal.authority}`
            : "")
        }
        onClose={() => setPaymentResultModal({ show: false, success: false, message: "" })}
      />

      {/* Add Credit Modal */}
      <AddCreditModal
        isOpen={showAddCreditModal}
        onClose={() => setShowAddCreditModal(false)}
        onSubmit={handlePaymentSubmit}
        isProcessing={isProcessingPayment}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7.5">
        {/* Left Section - Balance & Add Credit */}
        <div className="space-y-4 lg:space-y-7.5">
          {/* Balance Card */}
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#13C296]/[0.08]">
              <svg
                className="fill-[#13C296]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5V9H5C4.44772 9 4 9.44772 4 10C4 10.5523 4.44772 11 5 11H9V15C9 15.5523 9.44772 16 10 16C10.5523 16 11 15.5523 11 15V11H15C15.5523 11 16 10.5523 16 10C16 9.44772 15.5523 9 15 9H11V5Z"
                />
              </svg>
            </div>

            <div className="mt-6">
              <div>
                <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                  {formatAmount(balance)}
                </h4>
                <span className="text-sm font-medium text-dark-6">موجودی حساب</span>
              </div>
            </div>
          </div>

          {/* Add Credit Card */}
          <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              افزایش اعتبار
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              برای افزایش موجودی حساب خود، روی دکمه زیر کلیک کنید.
            </p>
            <Button
              label="افزایش اعتبار"
              variant="primary"
              shape="rounded"
              onClick={() => setShowAddCreditModal(true)}
              className="w-full"
            />
          </div>
        </div>

        {/* Right Section - Transactions List */}
        <div className="lg:col-span-2 rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
            <h3 className="text-xl font-bold text-dark dark:text-white">
              تاریخچه تراکنش‌ها
            </h3>
          </div>

          <div className="p-4 sm:p-7.5">
            {credits.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-body-color dark:text-dark-6 text-lg">
                  هیچ تراکنشی یافت نشد
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                        <TableHead className="min-w-[120px]">مبلغ</TableHead>
                        <TableHead>توضیحات</TableHead>
                        <TableHead>نوع</TableHead>
                        <TableHead>تاریخ</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {credits.map((credit, index) => (
                        <TableRow key={credit.id || index} className="border-[#eee] dark:border-dark-3">
                          <TableCell className="min-w-[120px]">
                            <h5 className={cn(
                              "font-medium",
                              credit.amount > 0
                                ? "text-[#219653]"
                                : "text-[#D34053]"
                            )}>
                              {credit.amount > 0 ? '+' : ''}{formatAmount(credit.amount)}
                            </h5>
                          </TableCell>

                          <TableCell>
                            <p className="text-dark dark:text-white">
                              {credit.description || "بدون توضیحات"}
                            </p>
                          </TableCell>

                          <TableCell>
                            <div
                              className={cn(
                                "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                                credit.amount > 0
                                  ? "bg-[#219653]/[0.08] text-[#219653]"
                                  : "bg-[#D34053]/[0.08] text-[#D34053]"
                              )}
                            >
                              {credit.amount > 0 ? "افزایش" : "کاهش"}
                            </div>
                          </TableCell>

                          <TableCell>
                            <p className="text-dark dark:text-white">
                              {dayjs(credit.created_at).locale('fa').format("YYYY/MM/DD HH:mm")}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {dayjs(credit.created_at).locale('fa').fromNow()}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {hasMore && (
                  <div className="mt-6 text-center">
                    <Button
                      label={isLoadingCredits ? "در حال بارگذاری..." : "بارگذاری بیشتر"}
                      onClick={handleLoadMore}
                      disabled={isLoadingCredits}
                      variant="outlinePrimary"
                      shape="rounded"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function FinancialPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7.5">
          <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-3 dark:bg-dark-3 rounded"></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            <div className="animate-pulse space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-3 dark:bg-dark-3 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <FinancialPageContent />
    </Suspense>
  );
}
