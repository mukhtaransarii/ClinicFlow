import { z } from 'zod';
export const appointmentSchema = z.object({
  doctorId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  purpose: z.string().min(1).max(300),
  notes: z.string().max(2000).optional()
});
export const statusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED']),
  notes: z.string().max(2000).optional()
});
