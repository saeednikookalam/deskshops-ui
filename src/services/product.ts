import { apiClient } from '@/lib/api-client';

export interface Product {
  id: number;
  name: string;
  sku?: string;
  image_url?: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  source: string;
  source_logo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
}

class ProductService {
  async getProducts(page: number = 1, perPage: number = 20): Promise<ProductListResponse> {
    const data = await apiClient.get<ProductListResponse>(
      `/api/products/list?page=${page}&per_page=${perPage}`
    );
    return data;
  }

  async getProductById(id: number): Promise<Product> {
    return await apiClient.get<Product>(`/api/products/${id}`);
  }

  async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
    return await apiClient.delete(`/api/products/${id}`);
  }
}

export const productService = new ProductService();
