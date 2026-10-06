import z from 'zod';
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(72),
});
export const singupSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(72),
  name: z.string().min(1).max(50)
});
