/**
 * Zod schemas for API input validation.
 */
import { z } from 'zod';

const subscriptionTierSchema = z.enum(['basic', 'premium', 'all']);
const repeatKindSchema = z.enum(['none', 'daily', 'weekly']);

/** YYYY-MM-DD */
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');
/** HH:mm */
const timeStr = z.string().regex(/^\d{1,2}:\d{2}(:\d{2})?$/, 'Invalid time format (HH:mm)');

export const eventPostSchema = z.object({
  title: z.string().min(1).max(200),
  date: dateStr,
  startTime: timeStr,
  endTime: timeStr,
  type: z.string().max(50).default('clinic'),
  program: z.string().max(100).default('General'),
  location: z.string().max(200).default('Main facility'),
  subscriptionTier: subscriptionTierSchema.default('basic'),
  capacity: z.number().int().min(1).max(1000).default(10),
  featured: z.boolean().default(false),
});

export const recurringPostSchema = z.object({
  title: z.string().min(1).max(200),
  startDate: dateStr,
  endDate: dateStr,
  startTime: timeStr,
  endTime: timeStr,
  repeat: repeatKindSchema.default('weekly'),
  program: z.string().max(100).default('General'),
  type: z.string().max(50).default('clinic'),
  location: z.string().max(200).default('Main facility'),
  subscriptionTier: subscriptionTierSchema.default('basic'),
  capacity: z.number().int().min(1).max(1000).default(10),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
});

export const eventPatchSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(1).max(200).optional(),
  date: dateStr.optional(),
  startTime: timeStr.optional(),
  endTime: timeStr.optional(),
  type: z.string().max(50).optional(),
  program: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  capacity: z.number().int().min(1).max(1000).optional(),
  featured: z.boolean().optional(),
  subscriptionTier: subscriptionTierSchema.optional(),
});

const membershipOptionSchema = z.object({
  id: z.string().min(1).max(50),
  label: z.string().min(1).max(200),
  daysPerWeek: z.number().int().min(1).max(7),
  priceCents: z.number().int().min(0),
});

const membershipCategorySchema = z.enum(['adult', 'youth', 'remote']);

export const membershipSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  category: membershipCategorySchema,
  basePrice2Day: z.number().min(0),
  billingLabel: z.string().max(100),
  options: z.array(membershipOptionSchema).min(1).max(20),
});

export const membershipsPutSchema = z.object({
  memberships: z.array(membershipSchema).max(100),
});

export type EventPostInput = z.infer<typeof eventPostSchema>;
export type RecurringPostInput = z.infer<typeof recurringPostSchema>;
export type EventPatchInput = z.infer<typeof eventPatchSchema>;
