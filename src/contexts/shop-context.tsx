"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type PropsWithChildren } from "react";
import { apiClient } from "@/lib/api-client";

/**
 * Shop interface representing a user's shop
 */
export interface Shop {
  id: number;
  user_id: number;
  type: number;
  title: string;
  logo?: string;
  identifier?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Selected shop can be a specific shop, 'all' for aggregated view, or null before loading
 */
export type SelectedShop = Shop | 'all' | null;

interface ShopContextValue {
  shops: Shop[];
  selectedShop: SelectedShop;
  isLoading: boolean;
  error: string | null;
  selectShop: (shop: Shop | 'all') => void;
  refreshShops: () => Promise<void>;
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const SHOP_STATE_STORAGE_KEY = 'shop-state';

/**
 * ShopProvider - Manages shop selection state across the application
 *
 * Features:
 * - Fetches all shops for the current user
 * - Persists selected shop to localStorage
 * - Defaults to 'all' shops when shops load
 * - Provides refresh capability
 */
export function ShopProvider({ children }: PropsWithChildren) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<SelectedShop>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  /**
   * Persist shop state to localStorage
   */
  const persistShopState = useCallback((shop: SelectedShop) => {
    if (typeof window === 'undefined') return;

    const state = {
      selectedShop: shop === 'all' ? 'all' : shop?.id || null,
      timestamp: Date.now(),
    };
    localStorage.setItem(SHOP_STATE_STORAGE_KEY, JSON.stringify(state));
  }, []);

  /**
   * Load shop state from localStorage
   */
  const loadShopState = useCallback((): SelectedShop => {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(SHOP_STATE_STORAGE_KEY);
      if (!stored) return null;

      const state = JSON.parse(stored);
      // Return null for now - will be resolved after shops load
      return null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Fetch shops from API
   */
  const fetchShops = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<any>('/shops');
      if (response.data && Array.isArray(response.data)) {
        const fetchedShops: Shop[] = response.data;
        setShops(fetchedShops);

        // Try to restore previous selection
        const stored = localStorage.getItem(SHOP_STATE_STORAGE_KEY);
        if (stored) {
          try {
            const state = JSON.parse(stored);
            if (state.selectedShop === 'all') {
              setSelectedShop('all');
            } else if (state.selectedShop) {
              const found = fetchedShops.find((s) => s.id === state.selectedShop);
              setSelectedShop(found || 'all');
            } else {
              setSelectedShop('all');
            }
          } catch {
            setSelectedShop('all');
          }
        } else {
          // Default to 'all' when no previous selection
          setSelectedShop('all');
        }
      }
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError('Failed to load shops');
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Select a shop or 'all' shops
   */
  const selectShop = useCallback((shop: Shop | 'all') => {
    setSelectedShop(shop);
    persistShopState(shop);
  }, [persistShopState]);

  /**
   * Refresh shops from API
   */
  const refreshShops = useCallback(async () => {
    hasFetched.current = false;
    await fetchShops();
  }, [fetchShops]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Initialize state from storage
    loadShopState();

    // Fetch shops
    fetchShops();
  }, [fetchShops, loadShopState]);

  const value: ShopContextValue = {
    shops,
    selectedShop,
    isLoading,
    error,
    selectShop,
    refreshShops,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

/**
 * useShop hook - Access shop context
 *
 * @throws Error if used outside ShopProvider
 */
export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
