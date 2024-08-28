import { z } from 'zod';

export const registrationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  teacher_id: z.string().min(1, { message: 'Teacher ID is required' }),
  specialization: z.string().min(1, { message: 'Specialization is required' }),
});
