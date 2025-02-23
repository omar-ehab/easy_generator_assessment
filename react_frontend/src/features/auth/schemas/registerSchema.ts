import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'name is required and must be at least 3 characters' })
    .max(50),
  email: z.string().min(1, { message: 'email is required' }).email().max(50),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Za-z]/, 'Must contain at least one letter')
    .regex(/\d/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});

export type RegisterFormType = z.infer<typeof registerSchema>;
