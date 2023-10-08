import { z } from 'zod';

export const newUserSchema = z
  .object({
    username: z.string().trim().min(4, {
      message: 'Please provide a username with 4 characters or more',
    }),
    email: z.string().email('Please provide a valid email address'),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type NewUser = z.infer<typeof newUserSchema>;
