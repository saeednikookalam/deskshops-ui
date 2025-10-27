"use client";

import { PluginCard } from "@/components/ui/plugin-card";
import { CustomPluginRequestCard } from "@/components/ui/custom-plugin-request-card";
import { CustomPluginRequestModal } from "@/components/ui/custom-plugin-request-modal";
import { pluginService, type Plugin } from "@/services/plugin";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";

export default function PluginsPage() {
  const router = useRouter();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const pageRef = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

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
        const nextPlugins = append ? [...prev, ...response.plugins] : response.plugins;

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
  }, []);

  // Initial load - only once
  useEffect(() => {
    loadPlugins(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

            {plugins.map((plugin) => (
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
                logoUrl={plugin.logo_url}
                onCardClick={() => handleCardClick(plugin)}
              />
            ))}
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
