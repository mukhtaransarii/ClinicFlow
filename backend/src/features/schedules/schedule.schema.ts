import { z } from 'zod';
export const scheduleSchema = z.object({
  doctorId: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  slotDuration: z.number().int().min(5).max(240)
});
