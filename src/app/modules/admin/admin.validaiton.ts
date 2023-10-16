import { z } from 'zod';

const makeAdminZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User id is required',
    }),
  }),
});

export const AdminValidation = {
  makeAdminZodSchema,
};
