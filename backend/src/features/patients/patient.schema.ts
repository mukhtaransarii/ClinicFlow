import { z } from 'zod';
export const patientSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(5).max(30),
  email: z.email().optional(),
  notes: z.string().max(2000).optional()
});
