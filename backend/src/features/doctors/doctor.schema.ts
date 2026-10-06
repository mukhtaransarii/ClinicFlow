import { z } from 'zod';
export const doctorSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(30).optional(),
  email: z.email().optional(),
  specialization: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  image: z.url().optional(),
  active: z.boolean().optional()
});
