#!/usr/bin/env node

/**
 * Script to synchronize types between Payload and Dashboard
 */

const fs = require('fs');
const path = require('path');

const PAYLOAD_TYPES_PATH = path.join(__dirname, '../src/payload-types.ts');
const DASHBOARD_TYPES_OUTPUT = path.join(__dirname, '../src/dashboard-types.ts');

// Collections that need workflow status
const COLLECTIONS_WITH_WORKFLOW = ['Experience', 'Attraction', 'Offer', 'Post'];

function generateDashboardTypes() {
  console.log('🔄 Generating dashboard types...');

  if (!fs.existsSync(PAYLOAD_TYPES_PATH)) {
    console.error('❌ Payload types not found. Run generate:types in admin app first.');
    process.exit(1);
  }

  // Read payload types
  const payloadTypes = fs.readFileSync(PAYLOAD_TYPES_PATH, 'utf-8');

  // Extract collection names
  const collectionMatches = [...payloadTypes.matchAll(/export interface (\w+) \{/g)];
  const collections = collectionMatches.map(match => match[1]);

  console.log(`📦 Found collections: ${collections.join(', ')}`);

  // Generate dashboard-specific types
  let dashboardTypes = `// Auto-generated dashboard types based on Payload collections
// Generated at: ${new Date().toISOString()}

import type { ${collections.join(', ')} } from './payload-types';

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
`;

  // Generate extended types for collections with workflow
  collections.forEach(collection => {
    if (COLLECTIONS_WITH_WORKFLOW.includes(collection)) {
      dashboardTypes += `
// Extended ${collection} type for Dashboard
export interface Dashboard${collection} extends Partial<${collection}>, WorkflowMetadata {}

// Form data for ${collection}
export type ${collection}FormData = Omit<${collection}, 'id' | 'createdAt' | 'updatedAt'>;
`;
    }
  });

  // Add common types
  dashboardTypes += `
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
`;

  // Write the generated types
  fs.writeFileSync(DASHBOARD_TYPES_OUTPUT, dashboardTypes);
  console.log('✅ Dashboard types generated successfully!');
}

// Run the generator
generateDashboardTypes();
