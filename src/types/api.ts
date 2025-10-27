/**
 * Shared API types for all services
 */

// Base API Response structure
export interface ApiResponse<T = unknown> {
  status: number;
  message: string | string[];
  data?: T;
  meta?: Record<string, unknown>;
}
