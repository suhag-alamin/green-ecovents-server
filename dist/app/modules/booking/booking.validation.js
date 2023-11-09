"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createBookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z
            .enum([...Object.values(client_1.BookingStatus)], {
            required_error: 'Status is required',
        })
            .default(client_1.BookingStatus.pending),
        startDate: zod_1.z.string({
            required_error: 'Start Date is required',
        }),
        endDate: zod_1.z.string({
            required_error: 'End Date is required',
        }),
        adults: zod_1.z.number({
            required_error: 'Number of Adults is required',
        }),
        childrens: zod_1.z.number().optional(),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email(),
        contactNo: zod_1.z.string({
            required_error: 'Contact No is required',
        }),
        totalAmount: zod_1.z.number({
            required_error: 'Total Amount is required',
        }),
        daysBooked: zod_1.z.number({
            required_error: 'Days Booked is required',
        }),
        userId: zod_1.z.string({
            required_error: 'User id is required',
        }),
        eventId: zod_1.z.string({
            required_error: 'Event id is required',
        }),
    }),
});
const updateBookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z
            .enum([...Object.values(client_1.BookingStatus)], {})
            .optional(),
        startDate: zod_1.z.string({}).optional(),
        endDate: zod_1.z.string({}).optional(),
        userId: zod_1.z.string({}).optional(),
        eventId: zod_1.z.string({}).optional(),
        adults: zod_1.z.number({}).optional(),
        childrens: zod_1.z.number({}).optional(),
        email: zod_1.z.string({}).optional(),
        contactNo: zod_1.z.string({}).optional(),
        totalAmount: zod_1.z.number({}).optional(),
        daysBooked: zod_1.z.number({}).optional(),
    }),
});
const confirmBookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number({
            required_error: 'Amount is required',
        }),
        currency: zod_1.z.string({
            required_error: 'Currency is required',
        }),
        paymentId: zod_1.z.string({
            required_error: 'Payment Id is required',
        }),
        userId: zod_1.z.string({
            required_error: 'User Id is required',
        }),
        bookingId: zod_1.z.string({
            required_error: 'Booking Id is required',
        }),
    }),
});
exports.BookingValidation = {
    createBookingZodSchema,
    updateBookingZodSchema,
    confirmBookingZodSchema,
};
