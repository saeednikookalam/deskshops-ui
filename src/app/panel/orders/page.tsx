"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Order } from "@/services/order";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

// Fake data generator
const generateFakeOrders = (page: number, perPage: number): Order[] => {
  const orders: Order[] = [];
  const sources = [
    { name: 'Basalam', logo: 'https://example.com/basalam-logo.png' },
    { name: 'Digikala', logo: 'https://example.com/digikala-logo.png' },
    { name: 'Manual', logo: null },
  ];
  const statuses: Order['status'][] = ['pending', 'processing', 'completed', 'cancelled'];
  const customers = ['علی احمدی', 'فاطمه رضایی', 'محمد حسینی', 'زهرا محمدی', 'حسین کریمی'];

  for (let i = 0; i < perPage; i++) {
    const id = (page - 1) * perPage + i + 1;
    const source = sources[Math.floor(Math.random() * sources.length)];
    const randomDaysAgo = Math.floor(Math.random() * 30);

    orders.push({
      id,
      order_number: `ORD-${String(id).padStart(6, '0')}`,
      customer_name: customers[Math.floor(Math.random() * customers.length)],
      total_amount: Math.floor(Math.random() * 100000000) + 5000000, // 500,000 to 10,000,000 Toman in Rial
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: source.name,
      source_logo: source.logo,
      created_at: dayjs().subtract(randomDaysAgo, 'day').toISOString(),
    });
  }
  return orders;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLTableRowElement>(null);

  const loadOrders = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const fakeOrders = generateFakeOrders(pageNum, 20);
      const total = 100; // Total fake orders

      let totalLoaded = 0;
      setOrders(prev => {
        const nextOrders = append ? [...prev, ...fakeOrders] : fakeOrders;
        totalLoaded = nextOrders.length;
        return nextOrders;
      });
      setHasMore(totalLoaded < total && fakeOrders.length > 0);

    } catch (error) {
      console.error('Error loading orders:', error);
      setError(error instanceof Error ? error.message : 'خطا در بارگذاری سفارشات');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(1);
  }, [loadOrders]);

  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadOrders(nextPage, true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, page, loadOrders]);

  const formatPrice = (price: number) => {
    const tomanPrice = price / 10;
    return tomanPrice.toLocaleString('fa-IR') + ' تومان';
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'در انتظار', className: 'bg-[#FFA70B]/[0.08] text-[#FFA70B]' },
      processing: { label: 'در حال پردازش', className: 'bg-[#3C50E0]/[0.08] text-[#3C50E0]' },
      completed: { label: 'تکمیل شده', className: 'bg-[#219653]/[0.08] text-[#219653]' },
      cancelled: { label: 'لغو شده', className: 'bg-[#D34053]/[0.08] text-[#D34053]' },
    };

    const config = statusConfig[status];
    return (
      <div className={cn('max-w-fit rounded-full px-3.5 py-1 text-sm font-medium', config.className)}>
        {config.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="animate-pulse space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-3 dark:bg-dark-3 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="text-center py-12">
          <div className="text-red text-lg mb-4">{error}</div>
          <button
            onClick={() => {
              setPage(1);
              loadOrders(1);
            }}
            className="text-primary hover:underline"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <h2 className="text-xl font-bold text-dark dark:text-white mb-6">لیست سفارشات</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-body-color dark:text-dark-6 text-lg">
            هیچ سفارشی یافت نشد
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="min-w-[140px] xl:pl-7.5">شماره سفارش</TableHead>
              <TableHead className="min-w-[120px]">تاریخ</TableHead>
              <TableHead className="min-w-[140px]">مشتری</TableHead>
              <TableHead className="min-w-[140px]">مبلغ</TableHead>
              <TableHead className="min-w-[140px]">وضعیت</TableHead>
              <TableHead className="min-w-[120px]">منبع</TableHead>
              <TableHead className="min-w-[100px] xl:pr-7.5">عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="min-w-[140px] xl:pl-7.5">
                  <h5 className="text-dark dark:text-white font-medium text-base">#{order.order_number}</h5>
                </TableCell>

                <TableCell className="min-w-[120px]">
                  <p className="text-dark dark:text-white text-base">
                    {dayjs(order.created_at).format("DD MMM YYYY")}
                  </p>
                </TableCell>

                <TableCell className="min-w-[140px]">
                  <p className="text-body-color dark:text-dark-6 text-base">{order.customer_name}</p>
                </TableCell>

                <TableCell className="min-w-[140px]">
                  <p className="text-dark dark:text-white font-medium text-base">{formatPrice(order.total_amount)}</p>
                </TableCell>

                <TableCell className="min-w-[140px]">{getStatusBadge(order.status)}</TableCell>

                <TableCell className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    {order.source_logo ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-2 dark:bg-dark-2">
                        <Image
                          src={order.source_logo}
                          alt={order.source}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary font-bold">
                          {order.source.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-body-color dark:text-dark-6 text-base">{order.source}</span>
                  </div>
                </TableCell>

                <TableCell className="min-w-[100px] xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button className="hover:text-primary">
                      <span className="sr-only">مشاهده جزئیات</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <button className="hover:text-primary">
                      <span className="sr-only">ویرایش</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <TableRow ref={loadingRef} className="border-none">
                <TableCell colSpan={7} className="text-center py-8">
                  {loadingMore ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-body-color dark:text-dark-6">در حال بارگذاری...</span>
                    </div>
                  ) : (
                    <span className="text-body-color dark:text-dark-6">اسکرول کنید تا موارد بیشتری بارگذاری شود</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
