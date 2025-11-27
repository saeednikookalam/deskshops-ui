import { apiClient } from '@/lib/api-client';

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
  // Menu related fields
  menu_title?: string;
  menu_icon?: string;
  menu_path?: string;
  menu_order?: number;
}

export interface PluginListResponse {
  plugins: Plugin[];
  total?: number;
  page?: number;
  per_page?: number;
}

interface ApiPluginResponse {
  id?: number;
  name: string;
  display_name?: string;
  description?: string;
  version?: string;
  author?: string;
  is_active?: boolean;
  total_installations?: number;
  monthly_price?: string;
  yearly_price?: string;
  logo_url?: string;
  has_subscription?: boolean;
  created_at?: string;
  updated_at?: string;
  // Menu fields from API
  menu_title?: string;
  menu_icon?: string;
  menu_path?: string;
  menu_order?: number;
}

interface ApiPluginListResponse {
  plugins?: ApiPluginResponse[];
  total_count?: number;
}

class PluginService {
  async getPluginsList(page: number = 1, perPage: number = 20): Promise<PluginListResponse> {
    const response = await apiClient.get<ApiPluginListResponse>(`/api/plugins/list?page=${page}&per_page=${perPage}`);

    // Transform API response to match our interface
    const plugins: Plugin[] = response.plugins ? response.plugins.map((plugin: ApiPluginResponse) => ({
      id: plugin.id,
      name: plugin.name,
      display_name: plugin.display_name || plugin.name,
      description: plugin.description,
      version: plugin.version,
      author: plugin.author,
      status: plugin.is_active ? 'active' : 'inactive',
      is_active: plugin.is_active,
      user_count: plugin.total_installations || 0,
      monthly_price: plugin.monthly_price,
      yearly_price: plugin.yearly_price,
      logo_url: plugin.logo_url,
      has_subscription: plugin.has_subscription || false,
      created_at: plugin.created_at,
      updated_at: plugin.updated_at,
      // Menu fields
      menu_title: plugin.menu_title,
      menu_icon: plugin.menu_icon,
      menu_path: plugin.menu_path,
      menu_order: plugin.menu_order,
    })) : [];

    return {
      plugins,
      total: response.total_count || plugins.length,
      page: page,
      per_page: perPage,
    };
  }

  async getUserSubscriptions(): Promise<{ plugin_ids: number[] }> {
    return await apiClient.get<{ plugin_ids: number[] }>('/api/subscriptions/my-subscriptions');
  }

  async createSubscription(pluginName: string, planType: 'monthly' | 'yearly'): Promise<void> {
    // Validation
    if (!pluginName) {
      throw new Error('نام پلاگین معتبر نیست');
    }

    if (!planType || (planType !== 'monthly' && planType !== 'yearly')) {
      throw new Error('نوع پلن معتبر نیست');
    }

    const payload = {
      plugin_name: pluginName.trim(),
      plan_type: planType
    };

    console.log('Creating subscription with payload:', payload);

    try {
      await apiClient.post('/api/subscriptions/create', payload);
      console.log('Subscription created successfully');
    } catch (error) {
      console.error('Error creating subscription:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          // @ts-expect-error - checking for status
          status: error.status,
          // @ts-expect-error - checking for data
          data: error.data
        });
      }
      throw error;
    }
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
      } catch {
        // If subscription check fails, return plugins without subscription status
        return pluginsResponse;
      }
    } catch (error) {
      throw error;
    }
  }
}

export const pluginService = new PluginService();