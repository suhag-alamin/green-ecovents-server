import { Gender, UserRole } from '@prisma/client';
import { z } from 'zod';

const makeAdminZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User id is required',
    }),
  }),
});

const updateAdminZodSchema = z.object({
  body: z.object({
    firstName: z.string({}).optional(),
    lastName: z.string({}).optional(),
    contactNo: z.string({}).optional(),
    role: z
      .enum([...Object.values(UserRole)] as [string, ...string[]], {})
      .optional(),
    gender: z
      .enum([...Object.values(Gender)] as [string, ...string[]], {})
      .optional(),
  }),
});

export const AdminValidation = {
  makeAdminZodSchema,
  updateAdminZodSchema,
};
