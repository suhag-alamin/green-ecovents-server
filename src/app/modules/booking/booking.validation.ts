import { BookingStatus } from '@prisma/client';
import { z } from 'zod';

const createBookingZodSchema = z.object({
  body: z.object({
    status: z
      .enum([...Object.values(BookingStatus)] as [string, ...string[]], {
        required_error: 'Status is required',
      })
      .default(BookingStatus.pending),
    startDate: z.string({
      required_error: 'Start Date is required',
    }),
    endDate: z.string({
      required_error: 'End Date is required',
    }),
    adults: z.number({
      required_error: 'Number of Adults is required',
    }),
    children: z.number().optional(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    contactNo: z.string({
      required_error: 'Contact No is required',
    }),
    totalAmount: z.number({
      required_error: 'Total Amount is required',
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
    startDate: z.string({}).optional(),
    endDate: z.string({}).optional(),
    userId: z.string({}).optional(),
    eventId: z.string({}).optional(),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
};
