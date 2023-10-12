import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Category name is required',
    }),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
};
