import { BookingStatus } from '@prisma/client';
import { z } from 'zod';

const createBookingZodSchema = z.object({
  body: z.object({
    status: z
      .enum([...Object.values(BookingStatus)] as [string, ...string[]], {
        required_error: 'Status is required',
      })
      .default(BookingStatus.pending),
    date: z.string({
      required_error: 'Date is required',
    }),
    userId: z.string({
      required_error: 'User id is required',
    }),
    eventId: z.string({
      required_error: 'Event id is required',
    }),
  }),
});
const updateBookingZodSchema = z.object({
  body: z.object({
    status: z
      .enum([...Object.values(BookingStatus)] as [string, ...string[]], {})
      .optional(),
    description: z.string({}).optional(),
    date: z.date({}).optional(),
    userId: z.string({}).optional(),
    eventId: z.string({}).optional(),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
};
