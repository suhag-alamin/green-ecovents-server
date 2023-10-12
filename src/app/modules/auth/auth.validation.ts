import { UserRole } from '@prisma/client';
import { z } from 'zod';

const signupZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email address is required',
      })
      .email({
        message: 'Use valid email address',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
    firstName: z.string({
      required_error: 'First name is required',
    }),
    lastName: z.string({
      required_error: 'Last name is required',
    }),
    contactNo: z.string({
      required_error: 'Contact number is required',
    }),
    role: z
      .enum([...Object.values(UserRole)] as [string, ...string[]], {
        required_error: 'User role is required',
      })
      .default(UserRole.USER),
  }),
});
const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email address is required',
      })
      .email({
        message: 'Use valid email address',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export const AuthValidation = {
  signupZodSchema,
  loginZodSchema,
};
