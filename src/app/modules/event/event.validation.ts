import { z } from 'zod';

const createEventZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Event name is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    date: z.string({
      required_error: 'Date is required',
    }),
    location: z.string({
      required_error: 'Location is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }),
    image: z.string({
      required_error: 'Image is required',
    }),
  }),
});
const updateEventZodSchema = z.object({
  body: z.object({
    title: z.string({}).optional(),
    description: z.string({}).optional(),
    date: z.date({}).optional(),
    location: z.string({}).optional(),
    price: z.number({}).optional(),
    image: z.string({}).optional(),
  }),
});

export const EventValidation = {
  createEventZodSchema,
  updateEventZodSchema,
};
