import { z } from 'zod';

const updateUserZodSchema = z.object({
  body: z.object({
    firstName: z.string({}).optional(),
    lastName: z.string({}).optional(),
    contactNo: z.string({}).optional(),
    profileImg: z.string({}).optional(),
  }),
});

export const UserValidation = {
  updateUserZodSchema,
};
