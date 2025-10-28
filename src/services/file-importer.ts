import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

export interface ImportData {
  import_id?: number | null;
  status: number;
  total_rows: number;
  success_count: number;
  error_count: number;
}

export type ImportResponse = ApiResponse<ImportData>;

export interface ImportDetailData {
  import_id: number;
  file_type: string;
  status: number;
  total_rows: number;
  success_count: number;
  error_count: number;
  created_at: string;
  completed_at?: string | null;
}

export type ImportDetailResponse = ApiResponse<ImportDetailData>;

export interface ImportError {
  row_number: number;
  field: string;
  error_type: number;
}

export interface ImportErrorsListData {
  import_id: number;
  errors: ImportError[];
  total_errors: number;
}

export type ImportErrorsListResponse = ApiResponse<ImportErrorsListData>;

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
  async uploadFile(file: File): Promise<ImportData> {
    const formData = new FormData();
    formData.append('file', file);

    const data = await apiClient.uploadFile<ImportData>('/file-importer/upload', formData, 30000);

    // Handle different response formats
    if (data && typeof data === 'object') {
      return data as ImportData;
    }

    throw new Error('Invalid response format for file upload');
  }

  /**
   * Get list of all imports for the current user
   */
  async getImports(): Promise<ImportsListResponse> {
    const data = await apiClient.get<{ imports?: Import[]; total?: number } | Import[]>('/file-importer/');

    // Handle both { imports: [...], total: number } and direct Import[]
    if (Array.isArray(data)) {
      return {
        imports: data,
        total: data.length,
      };
    }

    if (data && typeof data === 'object' && 'imports' in data) {
      return {
        imports: data.imports || [],
        total: data.total || 0,
      };
    }

    return {
      imports: [],
      total: 0,
    };
  }

  /**
   * Get detailed information about a specific import
   */
  async getImportDetail(importId: number): Promise<ImportDetailData> {
    const data = await apiClient.get<ImportDetailData>(`/file-importer/imports/${importId}`);

    // Handle different response formats
    if (data && typeof data === 'object') {
      return data as ImportDetailData;
    }

    throw new Error('Invalid response format for import detail');
  }

  /**
   * Get validation errors for a specific import
   */
  async getImportErrors(
    importId: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<ImportErrorsListData> {
    const data = await apiClient.get<ImportErrorsListData | { import_id: number; errors: ImportError[]; total_errors: number }>(
      `/file-importer/imports/${importId}/errors?limit=${limit}&offset=${offset}`
    );

    // Handle different response formats
    if (data && typeof data === 'object') {
      return {
        import_id: data.import_id || importId,
        errors: data.errors || [],
        total_errors: data.total_errors || 0,
      };
    }

    return {
      import_id: importId,
      errors: [],
      total_errors: 0,
    };
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
