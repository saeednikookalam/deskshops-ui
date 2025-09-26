import { pluginService, type Plugin } from '@/services/plugin';

export interface MenuPlugin {
  id: number;
  name: string;
  title: string;
  icon: string;
  path: string;
  order: number;
}

type MenuUpdateListener = (plugins: MenuPlugin[]) => void;

export class PluginMenuManager {
  private static instance: PluginMenuManager;
  private activeMenuPlugins: MenuPlugin[] = [];
  private listeners: MenuUpdateListener[] = [];
  private isLoading = false;
  private lastFetch = 0;
  private readonly CACHE_DURATION = 30000; // 30 seconds

  private constructor() {}

  public static getInstance(): PluginMenuManager {
    if (!PluginMenuManager.instance) {
      PluginMenuManager.instance = new PluginMenuManager();
    }
    return PluginMenuManager.instance;
  }

  /**
   * Subscribe to menu updates
   */
  public subscribe(listener: MenuUpdateListener): () => void {
    this.listeners.push(listener);

    // Immediately call with current data
    listener(this.activeMenuPlugins);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Get current active menu plugins
   */
  public getActiveMenuPlugins(): MenuPlugin[] {
    return [...this.activeMenuPlugins];
  }

  /**
   * Refresh menu plugins from API
   */
  public async refreshMenus(): Promise<void> {
    // Prevent concurrent requests
    if (this.isLoading) {
      return;
    }

    // Check cache
    const now = Date.now();
    if (now - this.lastFetch < this.CACHE_DURATION && this.activeMenuPlugins.length > 0) {
      return;
    }

    try {
      this.isLoading = true;
      const response = await pluginService.getPluginsWithSubscriptionStatus();

      // Filter active plugins with subscriptions
      const menuPlugins: MenuPlugin[] = response.plugins
        .filter(plugin =>
          plugin.status === 'active' &&
          plugin.has_subscription &&
          plugin.id
        )
        .map(plugin => ({
          id: plugin.id!,
          name: plugin.name,
          title: plugin.menu_title || plugin.display_name || plugin.name,
          icon: plugin.menu_icon || plugin.logo_url || '',
          path: plugin.menu_path || `/panel/${plugin.name}`,
          order: plugin.menu_order || 999,
        }))
        .sort((a, b) => a.order - b.order);


      this.activeMenuPlugins = menuPlugins;
      this.lastFetch = now;
      this.notifyListeners();

    } catch (error) {
      console.error('Failed to refresh plugin menus:', error);
      // Keep existing menus on error
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Force refresh (ignores cache)
   */
  public async forceRefresh(): Promise<void> {
    this.lastFetch = 0;
    await this.refreshMenus();
  }

  /**
   * Add a plugin menu (called after successful purchase)
   */
  public async addPluginMenu(pluginId: number): Promise<void> {
    try {
      // Force refresh to get latest data
      await this.forceRefresh();
    } catch (error) {
      console.error('Failed to add plugin menu:', error);
    }
  }

  /**
   * Remove a plugin menu
   */
  public removePluginMenu(pluginId: number): void {
    const initialLength = this.activeMenuPlugins.length;
    this.activeMenuPlugins = this.activeMenuPlugins.filter(plugin => plugin.id !== pluginId);

    if (this.activeMenuPlugins.length !== initialLength) {
      this.notifyListeners();
    }
  }

  /**
   * Clear all menu plugins (useful for logout)
   */
  public clearMenus(): void {
    if (this.activeMenuPlugins.length > 0) {
      this.activeMenuPlugins = [];
      this.lastFetch = 0;
      this.notifyListeners();
    }
  }

  /**
   * Check if a plugin has an active menu
   */
  public hasPluginMenu(pluginId: number): boolean {
    return this.activeMenuPlugins.some(plugin => plugin.id === pluginId);
  }

  /**
   * Notify all listeners of menu changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener([...this.activeMenuPlugins]);
      } catch (error) {
        console.error('Error in menu listener:', error);
      }
    });
  }

  /**
   * Initialize menu manager (call on app start)
   */
  public async initialize(): Promise<void> {
    if (typeof window !== 'undefined') {
      await this.refreshMenus();
    }
  }
}

// Export singleton instance
export const pluginMenuManager = PluginMenuManager.getInstance();