import { apiClient } from '@/lib/api-client';

export interface ImportResponse {
  success: boolean;
  import_id?: number | null;
  status: number;
  total_rows: number;
  success_count: number;
  error_count: number;
  message: string;
}

export interface ImportDetailResponse {
  success: boolean;
  import_id: number;
  file_type: string;
  status: number;
  total_rows: number;
  success_count: number;
  error_count: number;
  created_at: string;
  completed_at?: string | null;
}

export interface ImportError {
  row_number: number;
  field: string;
  error_type: number;
}

export interface ImportErrorsListResponse {
  success: boolean;
  import_id: number;
  errors: ImportError[];
  total_errors: number;
}

export interface Import {
  import_id: number;
  file_type: string;
  status: number;
  total_rows: number;
  success_count: number;
  error_count: number;
  created_at: string;
  completed_at?: string | null;
}

export interface ImportsListResponse {
  imports: Import[];
  total: number;
}

class FileImporterService {
  /**
   * Upload a file (CSV, Excel, or JSON)
   */
  async uploadFile(file: File): Promise<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient.uploadFile<ImportResponse>('/file-importer/upload', formData, 30000);
  }

  /**
   * Get list of all imports for the current user
   */
  async getImports(): Promise<ImportsListResponse> {
    const data = await apiClient.get<{ imports?: Import[]; total?: number }>('/file-importer/');

    return {
      imports: data.imports || [],
      total: data.total || 0,
    };
  }

  /**
   * Get detailed information about a specific import
   */
  async getImportDetail(importId: number): Promise<ImportDetailResponse> {
    return await apiClient.get<ImportDetailResponse>(`/file-importer/imports/${importId}`);
  }

  /**
   * Get validation errors for a specific import
   */
  async getImportErrors(
    importId: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<ImportErrorsListResponse> {
    return await apiClient.get<ImportErrorsListResponse>(
      `/file-importer/imports/${importId}/errors?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Get error type description
   */
  getErrorTypeDescription(errorType: number): string {
    const errorTypes: Record<number, string> = {
      1: 'فیلد الزامی',
      2: 'فرمت نامعتبر',
      3: 'مقدار تکراری',
      4: 'مقدار خارج از محدوده',
      5: 'خطای ناشناخته',
    };
    return errorTypes[errorType] || 'خطای ناشناخته';
  }

  /**
   * Get status description
   */
  getStatusDescription(status: number): string {
    const statuses: Record<number, string> = {
      0: 'در انتظار',
      1: 'در حال پردازش',
      2: 'تکمیل شده',
      3: 'خطا در پردازش',
    };
    return statuses[status] || 'نامشخص';
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: number): 'success' | 'warning' | 'error' | 'info' {
    const colors: Record<number, 'success' | 'warning' | 'error' | 'info'> = {
      0: 'info',
      1: 'warning',
      2: 'success',
      3: 'error',
    };
    return colors[status] || 'info';
  }
}

export const fileImporterService = new FileImporterService();
