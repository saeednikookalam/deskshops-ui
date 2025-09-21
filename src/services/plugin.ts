const API_BASE_URL = 'http://127.0.0.1:8000';

export interface Plugin {
  id?: number;
  name: string;
  display_name?: string;
  description?: string;
  version?: string;
  author?: string;
  status?: 'active' | 'inactive' | 'disabled';
  is_active?: boolean;
  user_count?: number;
  monthly_price?: string;
  yearly_price?: string;
  logo_url?: string;
  has_subscription?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PluginListResponse {
  plugins: Plugin[];
  total?: number;
  page?: number;
  per_page?: number;
}

export interface PluginStatsResponse {
  total_plugins: number;
  active_plugins: number;
  inactive_plugins: number;
  total_subscriptions: number;
}

class PluginService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';

    // Ensure Bearer is capitalized
    const normalizedTokenType = tokenType.charAt(0).toUpperCase() + tokenType.slice(1).toLowerCase();

    console.log('Auth Debug:', {
      token: token ? 'exists' : 'missing',
      originalTokenType: tokenType,
      normalizedTokenType
    });

    if (!token) {
      console.warn('No access token found in localStorage');
      return {
        'Content-Type': 'application/json',
      };
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `${normalizedTokenType} ${token}`,
    };
  }

  async getPluginsList(page: number = 1, perPage: number = 20): Promise<PluginListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/plugins/list?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

    // Transform API response to match our interface
    const plugins: Plugin[] = data.plugins ? data.plugins.map((plugin: any) => ({
      id: plugin.id,
      name: plugin.name,
      display_name: plugin.display_name || plugin.name,
      description: plugin.description,
      version: plugin.version,
      author: plugin.author,
      status: plugin.is_active ? 'active' : 'inactive',
      is_active: plugin.is_active,
      user_count: plugin.user_count || 0,
      monthly_price: plugin.monthly_price,
      yearly_price: plugin.yearly_price,
      logo_url: plugin.logo_url,
      has_subscription: plugin.has_subscription || false,
      created_at: plugin.created_at,
      updated_at: plugin.updated_at,
    })) : [];

      return {
        plugins,
        total: data.total_count || plugins.length,
        page: page,
        per_page: perPage,
      };
    } catch (error) {
      // Try without authentication if token is invalid
      try {
        const response = await fetch(`${API_BASE_URL}/api/plugins/list?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw error; // Re-throw original error
        }

        const data = await response.json();

        const plugins: Plugin[] = data.plugins ? data.plugins.map((plugin: any) => ({
          id: plugin.id,
          name: plugin.name,
          display_name: plugin.display_name || plugin.name,
          description: plugin.description,
          version: plugin.version,
          author: plugin.author,
          status: plugin.is_active ? 'active' : 'inactive',
          is_active: plugin.is_active,
          user_count: plugin.user_count || 0,
          monthly_price: plugin.monthly_price,
          yearly_price: plugin.yearly_price,
          logo_url: plugin.logo_url,
          has_subscription: plugin.has_subscription || false,
          created_at: plugin.created_at,
          updated_at: plugin.updated_at,
        })) : [];

        return {
          plugins,
          total: data.total_count || plugins.length,
          page: page,
          per_page: perPage,
        };
      } catch {
        throw error; // Re-throw original error
      }
    }
  }

  async getPluginDetails(pluginName: string): Promise<Plugin> {
    const response = await fetch(`${API_BASE_URL}/api/plugins/${encodeURIComponent(pluginName)}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const plugin = await response.json();

    return {
      id: plugin.id,
      name: plugin.name,
      display_name: plugin.display_name || plugin.name,
      description: plugin.description,
      version: plugin.version,
      author: plugin.author,
      status: plugin.is_active ? 'active' : 'inactive',
      is_active: plugin.is_active,
      user_count: plugin.user_count || 0,
      created_at: plugin.created_at,
      updated_at: plugin.updated_at,
    };
  }

  async getPluginStats(): Promise<PluginStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/plugins/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getUserSubscriptions(): Promise<{ plugin_ids: number[] }> {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/my-subscriptions`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async createSubscription(pluginName: string, planType: 'monthly' | 'yearly'): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        plugin_name: pluginName,
        plan_type: planType
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getPluginsWithSubscriptionStatus(): Promise<PluginListResponse> {
    try {
      // First get plugins list
      const pluginsResponse = await this.getPluginsList(1, 100);

      // Then get user subscriptions
      try {
        const subscriptionsResponse = await this.getUserSubscriptions();
        const subscribedPluginIds = subscriptionsResponse.plugin_ids || [];

        // Mark plugins with subscription status
        const pluginsWithStatus = pluginsResponse.plugins.map(plugin => ({
          ...plugin,
          has_subscription: subscribedPluginIds.includes(plugin.id!)
        }));

        return {
          ...pluginsResponse,
          plugins: pluginsWithStatus
        };
      } catch (error) {
        // If subscription check fails, return plugins without subscription status
        return pluginsResponse;
      }
    } catch (error) {
      throw error;
    }
  }
}

export const pluginService = new PluginService();