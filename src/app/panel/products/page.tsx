"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Product } from "@/services/product";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Fake data generator
const generateFakeProducts = (page: number, perPage: number): Product[] => {
  const products: Product[] = [];
  const sources = [
    { name: 'Basalam', logo: 'https://example.com/basalam-logo.png' },
    { name: 'Digikala', logo: 'https://example.com/digikala-logo.png' },
    { name: 'Manual', logo: null },
  ];
  const statuses: Product['status'][] = ['active', 'inactive', 'out_of_stock'];

  for (let i = 0; i < perPage; i++) {
    const id = (page - 1) * perPage + i + 1;
    const source = sources[Math.floor(Math.random() * sources.length)];
    products.push({
      id,
      name: `محصول شماره ${id}`,
      sku: `PRD-${String(id).padStart(5, '0')}`,
      image_url: Math.random() > 0.3 ? `https://picsum.photos/seed/${id}/200/200` : undefined,
      price: Math.floor(Math.random() * 50000000) + 1000000, // 100,000 to 5,000,000 Toman in Rial
      stock: Math.floor(Math.random() * 100),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: source.name,
      source_logo: source.logo,
    });
  }
  return products;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLTableRowElement>(null);

  const loadProducts = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const fakeProducts = generateFakeProducts(pageNum, 20);
      const total = 100; // Total fake products

      let totalLoaded = 0;
      setProducts(prev => {
        const nextProducts = append ? [...prev, ...fakeProducts] : fakeProducts;
        totalLoaded = nextProducts.length;
        return nextProducts;
      });
      setHasMore(totalLoaded < total && fakeProducts.length > 0);

    } catch (error) {
      console.error('Error loading products:', error);
      setError(error instanceof Error ? error.message : 'خطا در بارگذاری محصولات');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

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
          loadProducts(nextPage, true);
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
  }, [hasMore, loadingMore, loading, page, loadProducts]);

  const formatPrice = (price: number) => {
    const tomanPrice = price / 10;
    return tomanPrice.toLocaleString('fa-IR') + ' تومان';
  };

  const getStatusBadge = (status: Product['status']) => {
    const statusConfig = {
      active: { label: 'فعال', className: 'bg-[#219653]/[0.08] text-[#219653]' },
      inactive: { label: 'غیرفعال', className: 'bg-[#D34053]/[0.08] text-[#D34053]' },
      out_of_stock: { label: 'ناموجود', className: 'bg-[#FFA70B]/[0.08] text-[#FFA70B]' },
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
              loadProducts(1);
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
      <h2 className="text-xl font-bold text-dark dark:text-white mb-6">لیست محصولات</h2>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-body-color dark:text-dark-6 text-lg">
            هیچ محصولی یافت نشد
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="min-w-[200px] xl:pl-7.5">محصول</TableHead>
              <TableHead className="min-w-[120px]">SKU</TableHead>
              <TableHead className="min-w-[140px]">قیمت</TableHead>
              <TableHead className="min-w-[100px]">موجودی</TableHead>
              <TableHead className="min-w-[120px]">وضعیت</TableHead>
              <TableHead className="min-w-[120px]">منبع</TableHead>
              <TableHead className="min-w-[100px] xl:pr-7.5">عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="min-w-[200px] xl:pl-7.5">
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-2 dark:bg-dark-2 flex-shrink-0">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-2 dark:bg-dark-2 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h5 className="text-dark dark:text-white font-medium text-base">{product.name}</h5>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="min-w-[120px]">
                  <p className="text-body-color dark:text-dark-6 text-base">{product.sku || '-'}</p>
                </TableCell>

                <TableCell className="min-w-[140px]">
                  <p className="text-dark dark:text-white font-medium text-base">{formatPrice(product.price)}</p>
                </TableCell>

                <TableCell className="min-w-[100px]">
                  <p className="text-dark dark:text-white text-base">{product.stock.toLocaleString('fa-IR')}</p>
                </TableCell>

                <TableCell className="min-w-[120px]">{getStatusBadge(product.status)}</TableCell>

                <TableCell className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    {product.source_logo ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-2 dark:bg-dark-2">
                        <Image
                          src={product.source_logo}
                          alt={product.source}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary font-bold">
                          {product.source.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-body-color dark:text-dark-6 text-base">{product.source}</span>
                  </div>
                </TableCell>

                <TableCell className="min-w-[100px] xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button className="hover:text-primary">
                      <span className="sr-only">ویرایش</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button className="hover:text-red">
                      <span className="sr-only">حذف</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
