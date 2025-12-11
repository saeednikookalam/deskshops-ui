"use client";

import { PluginCard } from "@/components/ui/plugin-card";
import { CustomPluginRequestCard } from "@/components/ui/custom-plugin-request-card";
import { CustomPluginRequestModal } from "@/components/ui/custom-plugin-request-modal";
import { pluginService, type Plugin } from "@/services/plugin";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export default function PluginsPage() {
  const router = useRouter();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [subscribedPluginIds, setSubscribedPluginIds] = useState<number[] | null>(null);
  const pageRef = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  const loadPlugins = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      const response = await pluginService.getPluginsList(pageNum, 20);

      setPlugins(prev => {
        // Mark plugins with subscription status based on subscribedPluginIds
        const currentSubscribedIds = subscribedPluginIds || [];
        const pluginsWithStatus = response.plugins.map(plugin => ({
          ...plugin,
          has_subscription: plugin.id ? currentSubscribedIds.includes(plugin.id) : false
        }));

        const nextPlugins = append ? [...prev, ...pluginsWithStatus] : pluginsWithStatus;

        // Calculate total loaded based on the new state
        const totalAvailable = response.total ?? 0;
        const totalLoaded = nextPlugins.length;
        setHasMore(totalLoaded < totalAvailable && response.plugins.length > 0);

        return nextPlugins;
      });

    } catch (error) {
      console.error('Error loading plugins:', error);
      setError(error instanceof Error ? error.message : 'خطا در بارگذاری پلاگین‌ها');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [subscribedPluginIds]);

  // Load user subscriptions and plugins - only once
  useEffect(() => {
    if (initialLoadDone.current) return;

    const loadData = async () => {
      initialLoadDone.current = true;

      try {
        // Load subscriptions first
        const subscriptionsResponse = await pluginService.getUserSubscriptions();
        const pluginIds = subscriptionsResponse.plugin_ids || [];
        setSubscribedPluginIds(pluginIds);

        // Then load plugins with subscription info
        const response = await pluginService.getPluginsList(1, 20);
        const pluginsWithStatus = response.plugins.map(plugin => ({
          ...plugin,
          has_subscription: plugin.id ? pluginIds.includes(plugin.id) : false
        }));

        setPlugins(pluginsWithStatus);
        const totalAvailable = response.total ?? 0;
        setHasMore(pluginsWithStatus.length < totalAvailable && response.plugins.length > 0);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'خطا در بارگذاری اطلاعات');
        setSubscribedPluginIds([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Infinite scroll implementation
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          pageRef.current += 1;
          loadPlugins(pageRef.current, true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore]);

  const handleCardClick = (plugin: Plugin) => {
    router.push(`/panel/plugins/${plugin.id}`);
  };

  // Custom icons for specific plugins - imported from sidebar icons
  const FileImporterIcon = (props: IconProps) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );

  const WebhookIcon = (props: IconProps) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      <circle cx="18" cy="6" r="2" fill="currentColor" />
      <circle cx="6" cy="18" r="2" fill="currentColor" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
    </svg>
  );

  const WooCommerceIcon = (props: IconProps) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7l3 5-3 5-3-5 3-5z" fill="currentColor"/>
      <path d="M9 12l3-3 3 3-3 3-3-3z" fill="currentColor"/>
    </svg>
  );

  const GoogleSheetIcon = (props: IconProps) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );

  const getPluginIcon = (pluginName: string) => {
    switch (pluginName) {
      case 'file_importer':
      case 'file-importer':
        return FileImporterIcon;
      case 'webhook':
        return WebhookIcon;
      case 'woocommerce':
        return WooCommerceIcon;
      case 'google sheet':
      case 'google_sheet':
      case 'google-sheet':
        return GoogleSheetIcon;
      default:
        return undefined; // Will use default icon
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Custom Plugin Request Card - Always First */}
          <CustomPluginRequestCard onClick={() => setIsRequestModalOpen(true)} />

          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark animate-pulse"
            >
              <div className="h-8 w-8 bg-gray-3 dark:bg-dark-3 rounded mb-4"></div>
              <div className="h-6 bg-gray-3 dark:bg-dark-3 rounded mb-2"></div>
              <div className="h-4 bg-gray-3 dark:bg-dark-3 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-3 dark:bg-dark-3 rounded flex-1"></div>
                <div className="h-8 bg-gray-3 dark:bg-dark-3 rounded flex-1"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <CustomPluginRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red text-lg mb-4">{error}</div>
          <button
            onClick={() => {
              pageRef.current = 1;
              loadPlugins(1);
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
    <div className="space-y-6">
      {plugins.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Custom Plugin Request Card - Always First */}
          <CustomPluginRequestCard onClick={() => setIsRequestModalOpen(true)} />

          <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
            <div className="text-body-color dark:text-dark-6 text-lg">
              هیچ پلاگینی یافت نشد
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Custom Plugin Request Card - Always First */}
            <CustomPluginRequestCard onClick={() => setIsRequestModalOpen(true)} />

            {plugins.map((plugin) => {
              const CustomIcon = getPluginIcon(plugin.name);
              return (
              <PluginCard
                key={plugin.id || plugin.name}
                name={plugin.display_name || plugin.name}
                description={plugin.description}
                status={plugin.status || 'inactive'}
                userCount={plugin.user_count}
                version={plugin.version}
                monthlyPrice={plugin.monthly_price}
                yearlyPrice={plugin.yearly_price}
                hasSubscription={plugin.has_subscription}
                logoUrl={CustomIcon ? undefined : plugin.logo_url}
                icon={CustomIcon}
                onCardClick={() => handleCardClick(plugin)}
              />
              );
            })}
          </div>

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loadingRef} className="py-8">
              {loadingMore ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark animate-pulse"
                    >
                      <div className="h-8 w-8 bg-gray-3 dark:bg-dark-3 rounded mb-4"></div>
                      <div className="h-6 bg-gray-3 dark:bg-dark-3 rounded mb-2"></div>
                      <div className="h-4 bg-gray-3 dark:bg-dark-3 rounded mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-3 dark:bg-dark-3 rounded flex-1"></div>
                        <div className="h-8 bg-gray-3 dark:bg-dark-3 rounded flex-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-body-color dark:text-dark-6">
                  در حال بارگذاری...
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <CustomPluginRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}
