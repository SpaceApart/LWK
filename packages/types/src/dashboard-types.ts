// Auto-generated dashboard types based on Payload collections
// Generated at: 2025-05-26T05:19:28.009Z

import type { User, Experience, Media } from './payload-types';

// Status workflow types
export type WorkflowStatus = 'draft' | 'pending_review' | 'published' | 'rejected';

// Workflow metadata
export interface WorkflowMetadata {
  workflowStatus?: WorkflowStatus;
  submittedBy?: string;
  submittedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}

// Extended Experience type for Dashboard
export interface DashboardExperience extends Partial<Experience>, WorkflowMetadata {}

// Form data for Experience
export type ExperienceFormData = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    totalDocs?: number;
    totalPages?: number;
  };
}

// Common filter types
export interface BaseFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
