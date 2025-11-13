"use client";

import { Button } from "@/components/ui-elements/button";
import { StatusModal } from "@/components/ui/status-modal";
import { Currency } from "@/components/ui/currency";
import { pluginService, type Plugin } from "@/services/plugin";
import { usePluginMenu } from "@/hooks/use-plugin-menu";
import { formatMessage } from "@/lib/message-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

export default function PluginDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addPluginMenu } = usePluginMenu();
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('monthly');

  // Status modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchPlugin = async () => {
      try {
        setLoading(true);
        const response = await pluginService.getPluginsWithSubscriptionStatus();
        const foundPlugin = response.plugins.find(p => p.id?.toString() === resolvedParams.id);

        if (foundPlugin) {
          setPlugin(foundPlugin);
        } else {
          setError('پلاگین مورد نظر یافت نشد');
        }
      } catch {
        setError('خطا در بارگذاری اطلاعات پلاگین');
      } finally {
        setLoading(false);
      }
    };

    fetchPlugin();
  }, [resolvedParams.id]);

  const getStatusTitle = () => {
    switch (purchaseStatus) {
      case 'loading':
        return 'در حال پردازش...';
      case 'success':
        return 'خرید موفق!';
      case 'error':
        return 'خطا در خرید';
      default:
        return '';
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setPurchaseStatus('idle');
    setStatusMessage('');
  };

  const handleSubscribe = async (duration: 'monthly' | 'yearly') => {
    if (!plugin?.name) {
      setStatusMessage('خطا: نام پلاگین موجود نیست');
      setPurchaseStatus('error');
      setShowStatusModal(true);
      return;
    }

    try {
      // Show loading status
      setPurchaseStatus('loading');
      setStatusMessage('در حال پردازش درخواست خرید...');
      setShowStatusModal(true);

      await pluginService.createSubscription(plugin.name, duration);

      // If no error thrown, it was successful
      setPurchaseStatus('success');
      setStatusMessage(`اشتراک ${duration === 'monthly' ? 'ماهانه' : 'سالانه'} با موفقیت خریداری شد!`);

      // Update plugin subscription status
      const updatedPlugin = { ...plugin!, has_subscription: true };
      setPlugin(updatedPlugin);

      // Add plugin menu if it has menu data and is active
      if (plugin?.id && plugin.status === 'active') {
        try {
          await addPluginMenu(plugin.id);

          // If it's basalam plugin, redirect to shops page
          if (plugin.name === 'basalam') {
            router.push('/panel/basalam/shops');
          }
        } catch (error) {
          console.error('Error adding plugin menu:', error);
        }
      }
    } catch (error) {
      setPurchaseStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'خطا در ارتباط با سرور';
      setStatusMessage(formatMessage(errorMessage));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-1 dark:bg-dark-2">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="h-8 w-32 bg-gray-3 dark:bg-dark-3 rounded"></div>

            {/* Hero section skeleton */}
            <div className="bg-white dark:bg-gray-dark rounded-[10px] p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="h-32 w-32 bg-gray-3 dark:bg-dark-3 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-3 dark:bg-dark-3 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-3 dark:bg-dark-3 rounded w-full"></div>
                  <div className="h-4 bg-gray-3 dark:bg-dark-3 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Content sections skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-dark rounded-[10px] p-6">
                  <div className="h-6 bg-gray-3 dark:bg-dark-3 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-3 dark:bg-dark-3 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-dark rounded-[10px] p-6">
                  <div className="h-6 bg-gray-3 dark:bg-dark-3 rounded w-1/2 mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-3 dark:bg-dark-3 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !plugin) {
    return (
      <div className="min-h-screen bg-gray-1 dark:bg-dark-2">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mb-6 text-6xl">❌</div>
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">خطا در بارگذاری</h2>
              <p className="text-body-color dark:text-dark-6 mb-8 text-lg">{error}</p>
              <div className="flex gap-4 justify-center">
                <Link href="/panel/plugins">
                  <Button label="بازگشت به پلاگین‌ها" variant="outlineDark" shape="rounded" />
                </Link>
                <Button
                  label="تلاش مجدد"
                  variant="primary"
                  shape="rounded"
                  onClick={() => window.location.reload()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const shouldShowSubscribeButton = plugin.status === 'active' && !plugin.has_subscription;

  return (
    <div className="space-y-6">

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Right: Plugin Details & Comments */}
        <div className={`${(plugin.monthly_price || plugin.yearly_price) ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>

          {/* Plugin Details */}
          <div className="bg-white dark:bg-gray-dark rounded-[10px] shadow-1 p-6">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-stroke dark:border-dark-3">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center text-white">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <rect x="9" y="9" width="6" height="6"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-dark dark:text-white">
                  {plugin.display_name || plugin.name}
                </h1>
                {plugin.description && (
                  <p className="text-body-color dark:text-dark-6 mt-2">
                    {plugin.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-body-color dark:text-dark-6">نام پلاگین:</span>
                  <span className="font-medium text-dark dark:text-white">{plugin.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-body-color dark:text-dark-6">نام نمایشی:</span>
                  <span className="font-medium text-dark dark:text-white">{plugin.display_name || plugin.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-body-color dark:text-dark-6">نسخه:</span>
                  <span className="font-medium text-dark dark:text-white">{plugin.version || 'نامشخص'}</span>
                </div>

                {plugin.author && (
                  <div className="flex justify-between">
                    <span className="text-body-color dark:text-dark-6">توسعه‌دهنده:</span>
                    <span className="font-medium text-dark dark:text-white">{plugin.author}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-body-color dark:text-dark-6">وضعیت:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plugin.status === 'active'
                      ? 'bg-green-light-6 text-green'
                      : 'bg-red-light-6 text-red'
                  }`}>
                    {plugin.status === 'active' ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>

                {plugin.user_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-body-color dark:text-dark-6">کاربران:</span>
                    <span className="font-medium text-dark dark:text-white">
                      {plugin.user_count.toLocaleString('fa-IR')}
                    </span>
                  </div>
                )}

                {plugin.created_at && (
                  <div className="flex justify-between">
                    <span className="text-body-color dark:text-dark-6">تاریخ انتشار:</span>
                    <span className="font-medium text-dark dark:text-white">
                      {new Date(plugin.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                )}

                {plugin.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-body-color dark:text-dark-6">آخرین بروزرسانی:</span>
                    <span className="font-medium text-dark dark:text-white">
                      {new Date(plugin.updated_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-dark rounded-[10px] shadow-1 p-6">
            <h2 className="text-xl font-bold text-dark dark:text-white mb-6 pb-3 border-b border-stroke dark:border-dark-3">
              نظرات کاربران
            </h2>

            {/* Placeholder for Comments */}
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                نظرات کاربران
              </h3>
              <p className="text-body-color dark:text-dark-6">
                این بخش برای نمایش نظرات و بازخوردهای کاربران در نظر گرفته شده است
              </p>
            </div>
          </div>
        </div>

        {/* Left: Pricing & Purchase */}
        {(plugin.monthly_price || plugin.yearly_price) && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-dark rounded-[10px] shadow-1 p-6">
              <h3 className="text-lg font-bold text-dark dark:text-white mb-6 pb-3 border-b border-stroke dark:border-dark-3">
                پلان‌های اشتراک
              </h3>

              <div className="space-y-4">
                {plugin.monthly_price && (
                  <div
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedDuration === 'monthly'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-stroke dark:border-dark-3 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDuration('monthly')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-dark dark:text-white">پلن ماهانه</h4>
                        <p className="text-xl font-bold text-primary">
                          <Currency value={parseFloat(plugin.monthly_price)} />
                        </p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 ${
                        selectedDuration === 'monthly'
                          ? 'border-primary bg-primary'
                          : 'border-stroke dark:border-dark-3'
                      }`}>
                        {selectedDuration === 'monthly' && (
                          <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {plugin.yearly_price && (
                  <div
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedDuration === 'yearly'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-stroke dark:border-dark-3 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDuration('yearly')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-dark dark:text-white">پلن سالانه</h4>
                        <p className="text-xl font-bold text-primary">
                          <Currency value={parseFloat(plugin.yearly_price)} />
                        </p>
                        {plugin.monthly_price && (
                          <p className="text-xs text-green mt-1">
                            صرفه‌جویی {Math.round((1 - (parseFloat(plugin.yearly_price) / 12) / parseFloat(plugin.monthly_price)) * 100)}%
                          </p>
                        )}
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 ${
                        selectedDuration === 'yearly'
                          ? 'border-primary bg-primary'
                          : 'border-stroke dark:border-dark-3'
                      }`}>
                        {selectedDuration === 'yearly' && (
                          <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Button */}
              <div className="mt-6 pt-4 border-t border-stroke dark:border-dark-3">
                {shouldShowSubscribeButton ? (
                  <Button
                    label={`خرید اشتراک ${selectedDuration === 'monthly' ? 'ماهانه' : 'سالانه'}`}
                    variant="primary"
                    shape="rounded"
                    className="w-full"
                    onClick={() => handleSubscribe(selectedDuration)}
                  />
                ) : plugin.has_subscription ? (
                  <div className="text-center py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-2 bg-green-light-6 text-green rounded-lg text-sm font-medium">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      اشتراک فعال
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-body-color dark:text-dark-6 text-sm">
                      این پلاگین قابل خرید نیست
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        status={purchaseStatus === 'idle' ? 'success' : purchaseStatus}
        title={getStatusTitle()}
        message={statusMessage}
        onClose={closeStatusModal}
      />
    </div>
  );
}