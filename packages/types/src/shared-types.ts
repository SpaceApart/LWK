// Shared types used by both Admin and Dashboard
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}

// Common status types
export type PublishStatus = 'draft' | 'published';

// Shared user roles
export type UserRole = 'admin' | 'editor' | 'viewer' | 'contributor';

// Common filter/sort types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Shared validation schemas (using Zod)
export * from './validation';
