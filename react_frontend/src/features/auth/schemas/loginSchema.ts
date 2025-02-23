import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'email is required' }).email().max(50),
  password: z
    .string()
    .min(1, { message: 'password is required' }),
});

export type LoginFormType = z.infer<typeof loginSchema>;
