import { z } from 'zod';

// Experience validation schemas
export const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.any(), // RichText - validated by Payload
  price_from: z.number().positive().optional(),
  price_to: z.number().positive().optional(),
  available_dates: z.array(
    z.object({
      date_range: z.object({
        start_date: z.string(),
        end_date: z.string(),
      }),
    })
  ).optional(),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
  }).optional(),
  images: z.array(
    z.object({
      image: z.union([z.string(), z.number()]),
    })
  ).optional(),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

// Partial schema for updates
export const experienceUpdateSchema = experienceSchema.partial();

// Filter validation
export const experienceFilterSchema = z.object({
  status: z.enum(['draft', 'pending_review', 'published', 'rejected']).optional(),
  search: z.string().optional(),
  priceRange: z.object({
    min: z.number().positive().optional(),
    max: z.number().positive().optional(),
  }).optional(),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'price_from']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
