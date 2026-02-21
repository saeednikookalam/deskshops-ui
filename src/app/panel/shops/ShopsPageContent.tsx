"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { shopService, type Shop, type ShopType } from "@/services/shop";
import { Alert } from "@/components/common/Alert";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { AddShopModal } from "@/components/shop-management/AddShopModal";
import { showToast } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";

type StatusFilter = "all" | "active" | "inactive";

export default function ShopsPageContent() {
  const searchParams = useSearchParams();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [marketplaces, setMarketplaces] = useState<ShopType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState<{ shop: Shop } | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const loadShops = useCallback(async () => {
    try {
      setLoading(true);
      const data = await shopService.getShops();
      setShops(data.shops);
    } catch (error) {
      console.error("Error loading shops:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در بارگذاری فروشگاه‌ها";
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMarketplaces = useCallback(async () => {
    try {
      const data = await shopService.getShopTypes();
      setMarketplaces(data);
    } catch (error) {
      console.error("Error loading marketplaces:", error);
    }
  }, []);

  useEffect(() => {
    // Check for redirect params from OAuth callback
    const status = searchParams.get('status');
    const message = searchParams.get('message');

    if (status) {
      if (status === 'success') {
        setAlert({
          type: 'success',
          message: message || 'فروشگاه جدید با موفقیت متصل شد!'
        });
      } else if (status === 'error') {
        setAlert({
          type: 'error',
          message: message || 'خطا در اتصال به بازار. لطفاً دوباره تلاش کنید.'
        });
      }

      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    loadShops();
    loadMarketplaces();
  }, [searchParams, loadShops, loadMarketplaces]);

  // Filter shops based on status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredShops(shops);
    } else if (statusFilter === "active") {
      setFilteredShops(shops.filter(s => s.is_active));
    } else {
      setFilteredShops(shops.filter(s => !s.is_active));
    }
  }, [shops, statusFilter]);

  const handleDisconnectClick = (shop: Shop) => {
    setDisconnectModal({ shop });
  };

  const handleDisconnectConfirm = async () => {
    if (!disconnectModal) return;

    try {
      setDisconnecting(true);
      await shopService.disconnectShop(disconnectModal.shop.id);
      showToast.success("فروشگاه با موفقیت قطع شد");
      setDisconnectModal(null);
      await loadShops();
    } catch (error) {
      console.error("Error disconnecting shop:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در قطع ارتباط فروشگاه";
      showToast.error(errorMessage);
    } finally {
      setDisconnecting(false);
    }
  };

  const getMarketplaceSlug = (shopType: number) => {
    const marketplace = marketplaces.find(m => m.id === shopType);
    return marketplace?.slug || 'unknown';
  };

  const getMarketplaceTitle = (shopType: number) => {
    const marketplace = marketplaces.find(m => m.id === shopType);
    return marketplace?.title || 'ناشناس';
  };

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header with Add Shop Button on Top */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            فروشگاه‌های من
          </h1>
          <p className="mt-1 text-body-color dark:text-dark-6">
            مدیریت فروشگاه‌های متصل به تمام مارکت‌پلیس‌ها
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-3 text-center font-medium text-white transition-all hover:bg-opacity-90"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m0-2.003 9.07-4.303-2.998.913-.002a2.002 2.003 2.003 0 .998.997 0 .998-.002.003.003V5a2.002 2.003 0 .998.997 0 .998-.002.003.003 5.001v-.998.995 5.002-2.998.913.002-2.002 2.998.004 5.002 4.002 4.002 6.003 6.002 8.995 2.998 11.003 2.003 0 0 6.002 4.002 6.002 8.995 2.998 11.003 2.003 0 0 6.002 4.002 6.002 8.995 2.998 11.003 2.003 0 0 6.002 4.002 6.002 8.995 2.998 11.003 2.003 0 0 6.002 4.002 6.002 8.995 2.998 11.003 2.003 0 0 6.002 4.002 6.002 8.995 2.998 11.003z"
            />
          </svg>
          افزودن فروشگاه
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-stroke dark:border-dark-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === "all"
              ? "border-b-2 border-primary text-primary"
              : "text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
          }`}
        >
          همه ({shops.length})
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === "active"
              ? "border-b-2 border-primary text-primary"
              : "text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
          }`}
        >
          فعال ({shops.filter(s => s.is_active).length})
        </button>
        <button
          onClick={() => setStatusFilter("inactive")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === "inactive"
              ? "border-b-2 border-primary text-primary"
              : "text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
          }`}
        >
          غیرفعال ({shops.filter(s => !s.is_active).length})
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <p className="text-body-color dark:text-dark-6">در حال بارگذاری...</p>
          </div>
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-[10px] bg-white p-10 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-2">
                <svg
                  className="h-10 w-10 text-body-color dark:text-dark-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
            <h2 className="mb-3 text-xl font-bold text-dark dark:text-white">
              {statusFilter === "all" ? "هنوز فروشگاهی متصل نشده" : `فروشگاه ${statusFilter === "active" ? "فعال" : "غیرفعال"} یافت نشد`}
            </h2>
            <p className="mb-8 text-body-color dark:text-dark-6">
              {statusFilter === "all"
                ? "برای شروع، فروشگاه خود را به یکی از مارکت‌پلیس‌ها متصل کنید"
                : "فیلتر را تغییر دهید تا فروشگاه‌های دیگر را ببینید"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"
            >
              {/* Shop Header */}
              <div className="mb-4 flex items-start gap-4">
                <div className="relative h-14 w-14 flex-shrink-0">
                  {shop.logo ? (
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src={shop.logo}
                        alt={shop.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-2 dark:bg-dark-2">
                      <svg
                        className="h-7 w-7 text-body-color dark:text-dark-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                  )}
                  <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                    shop.is_active ? 'bg-green' : 'bg-red'
                  } dark:border-gray-dark`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-base font-semibold text-dark dark:text-white">
                    {shop.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs rounded-full bg-gray-2 px-2 py-0.5 text-body-color dark:bg-dark-2 dark:text-dark-6">
                      {getMarketplaceTitle(shop.type)}
                    </span>
                  </div>
                  {shop.identifier && (
                    <p className="text-sm text-body-color dark:text-dark-6">
                      @{shop.identifier}
                    </p>
                  )}
                </div>
              </div>

              {/* Shop Stats */}
              <div className="mb-4 flex items-center gap-4 rounded-lg bg-gray-2 p-3 dark:bg-dark-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {shop.has_webhook ? 'وب‌هوک دارد' : 'وب‌هوک ندارد'}
                  </span>
                </div>
                <div className="h-4 w-px bg-stroke dark:bg-dark-3"></div>
                <div className="flex items-center gap-2">
                  {shop.is_active ? (
                    <>
                      <svg
                        className="h-4 w-4 text-green"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-dark dark:text-white">
                        فعال
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4 text-red"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-dark dark:text-white">
                        غیرفعال
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {getMarketplaceSlug(shop.type) === 'basalam' && (
                  <Link
                    href={`/panel/basalam/webhooks?shop_id=${shop.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-stroke px-4 py-2.5 text-center text-sm font-medium text-dark transition-all hover:bg-gray hover:text-primary dark:border-dark-3 dark:text-white dark:hover:bg-dark-2 dark:hover:text-primary"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    تنظیمات
                  </Link>
                )}
                <button
                  onClick={() => handleDisconnectClick(shop)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red/30 px-4 py-2.5 text-center text-sm font-medium text-red transition-all hover:bg-red/5"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  قطع ارتباط
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Shop Modal */}
      {addModalOpen && (
        <AddShopModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => {
            setAddModalOpen(false);
            loadShops();
          }}
        />
      )}

      {/* Disconnect Confirmation Modal */}
      {disconnectModal && (
        <ConfirmModal
          isOpen={true}
          title="قطع ارتباط فروشگاه"
          message={`آیا از قطع ارتباط فروشگاه "${disconnectModal.shop.title}" اطمینان دارید؟`}
          confirmText="قطع ارتباط"
          cancelText="انصراف"
          confirmVariant="primary"
          isLoading={disconnecting}
          onConfirm={handleDisconnectConfirm}
          onCancel={() => setDisconnectModal(null)}
        />
      )}
    </div>
  );
}
