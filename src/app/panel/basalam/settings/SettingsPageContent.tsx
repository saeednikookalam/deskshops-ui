"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { SettingToggle } from "@/components/basalam/SettingToggle";
import { Tabs } from "@/components/basalam/Tabs";
import { showToast } from "@/lib/toast";
import { apiClient } from "@/lib/api-client";

interface Setting {
  setting_id: number;
  title: string;
  description: string;
  user_setting_id: number | null;
  status: boolean;
  updated_at: string | null;
  category: string;
}

export default function SettingsPageContent() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("product");
  const initialLoadDone = useRef(false);

  const loadSettings = useCallback(async () => {
    try {
      setLoadingSettings(true);
      const response = await apiClient.get<{ settings: Setting[] } | Setting[]>('/plugins/basalam/settings');

      // Handle both { settings: [...] } and direct [...]
      if (Array.isArray(response)) {
        setSettings(response);
      } else if (response && typeof response === 'object' && 'settings' in response) {
        setSettings(response.settings);
      } else {
        console.error("Unexpected response format:", response);
        setSettings([]);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      const errorMessage = error instanceof Error ? error.message : "خطا در بارگذاری تنظیمات";
      showToast.error(errorMessage);
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSettingChange = async (settingId: number, title: string, newStatus: boolean) => {
    // Store previous settings for rollback
    const previousSettings = [...settings];

    // Update UI immediately
    setSettings((prev) =>
      prev.map((s) =>
        s.setting_id === settingId
          ? { ...s, status: newStatus, updated_at: new Date().toISOString() }
          : s
      )
    );

    try {
      const response = await apiClient.putWithFullResponse<{ success: boolean; message: string; setting: Setting }>(
        '/plugins/basalam/settings',
        {
          setting_id: settingId,
          status: newStatus,
        }
      );

      const message = response.message || `${title} ${newStatus ? "فعال" : "غیرفعال"} شد`;
      showToast.success(message);
    } catch (error) {
      // Revert on error
      setSettings(previousSettings);
      const errorMessage = error instanceof Error ? error.message : `خطا در تغییر ${title}`;
      showToast.error(errorMessage);
      console.error("Error updating setting:", error);
    }
  };

  return (
    <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {loadingSettings ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <p className="text-body-color dark:text-dark-6">در حال بارگذاری تنظیمات...</p>
          </div>
        </div>
      ) : settings.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-body-color dark:text-dark-6">هیچ تنظیماتی یافت نشد</p>
        </div>
      ) : (
        <>
          <Tabs
            tabs={[
              { id: "product", label: "محصولات" },
              { id: "order", label: "سفارشات" },
              { id: "reviews", label: "تجربه خرید" },
              { id: "general", label: "عمومی" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="space-y-1">
            {settings
              .filter((setting) => setting.category === activeTab)
              .map((setting) => (
                <SettingToggle
                  key={setting.setting_id}
                  id={`setting-${setting.setting_id}`}
                  label={setting.title}
                  description={setting.description}
                  enabled={setting.status}
                  onChange={(value) => handleSettingChange(setting.setting_id, setting.title, value)}
                  lastUpdated={setting.updated_at || undefined}
                />
              ))}
            {settings.filter((setting) => setting.category === activeTab).length === 0 && (
              <div className="flex min-h-[150px] items-center justify-center">
                <p className="text-body-color dark:text-dark-6">تنظیماتی در این بخش یافت نشد</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
