import { z } from 'zod';
export const updateClinicSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(30).optional(),
  email: z.email().optional(),
  address: z.string().max(300).optional(),
  timezone: z.string().max(100).optional(),
  bookingEnabled: z.boolean().optional()
}).strict();
