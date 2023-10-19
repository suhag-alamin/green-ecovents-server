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
        description: zod_1.z.string({}).optional(),
        startDate: zod_1.z.string({}).optional(),
        endDate: zod_1.z.string({}).optional(),
        userId: zod_1.z.string({}).optional(),
        eventId: zod_1.z.string({}).optional(),
    }),
});
exports.BookingValidation = {
    createBookingZodSchema,
    updateBookingZodSchema,
};
