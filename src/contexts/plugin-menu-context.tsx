"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { pluginMenuManager, type MenuPlugin } from '@/lib/plugin-menu-manager';

interface PluginMenuContextType {
  menuPlugins: MenuPlugin[];
  isLoading: boolean;
  refreshMenus: () => Promise<void>;
  addPluginMenu: (pluginId: number) => Promise<void>;
  removePluginMenu: (pluginId: number) => void;
  hasPluginMenu: (pluginId: number) => boolean;
}

const PluginMenuContext = createContext<PluginMenuContextType | undefined>(undefined);

interface PluginMenuProviderProps {
  children: React.ReactNode;
}

export function PluginMenuProvider({ children }: PluginMenuProviderProps) {
  const [menuPlugins, setMenuPlugins] = useState<MenuPlugin[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to menu manager updates
  useEffect(() => {
    const unsubscribe = pluginMenuManager.subscribe((plugins) => {
      setMenuPlugins(plugins);
    });

    return unsubscribe;
  }, []);

  // Initialize menu manager on mount
  useEffect(() => {
    const initializeMenus = async () => {
      setIsLoading(true);
      try {
        await pluginMenuManager.initialize();
      } catch (error) {
        console.error('Failed to initialize plugin menus:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMenus();
  }, []);

  const refreshMenus = useCallback(async () => {
    setIsLoading(true);
    try {
      await pluginMenuManager.forceRefresh();
    } catch (error) {
      console.error('Failed to refresh plugin menus:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPluginMenu = useCallback(async (pluginId: number) => {
    try {
      await pluginMenuManager.addPluginMenu(pluginId);
    } catch (error) {
      console.error('Failed to add plugin menu:', error);
    }
  }, []);

  const removePluginMenu = useCallback((pluginId: number) => {
    pluginMenuManager.removePluginMenu(pluginId);
  }, []);

  const hasPluginMenu = useCallback((pluginId: number) => {
    return pluginMenuManager.hasPluginMenu(pluginId);
  }, []);

  const contextValue: PluginMenuContextType = {
    menuPlugins,
    isLoading,
    refreshMenus,
    addPluginMenu,
    removePluginMenu,
    hasPluginMenu,
  };

  return (
    <PluginMenuContext.Provider value={contextValue}>
      {children}
    </PluginMenuContext.Provider>
  );
}

export function usePluginMenu(): PluginMenuContextType {
  const context = useContext(PluginMenuContext);

  if (context === undefined) {
    throw new Error('usePluginMenu must be used within a PluginMenuProvider');
  }

  return context;
}