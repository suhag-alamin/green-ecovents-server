"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventValidation = void 0;
const zod_1 = require("zod");
const createEventZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Event name is required',
        }),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        startDate: zod_1.z.string({
            required_error: 'Start Date is required',
        }),
        endDate: zod_1.z.string({
            required_error: 'End Date is required',
        }),
        location: zod_1.z.string({
            required_error: 'Location is required',
        }),
        price: zod_1.z.number({
            required_error: 'Price is required',
        }),
        image: zod_1.z.string({
            required_error: 'Image is required',
        }),
        userId: zod_1.z.string({
            required_error: 'User Id is required',
        }),
        categoryId: zod_1.z.string({
            required_error: 'Category Id is required',
        }),
    }),
});
const updateEventZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({}).optional(),
        description: zod_1.z.string({}).optional(),
        startDate: zod_1.z.string({}).optional(),
        endDate: zod_1.z.string({}).optional(),
        location: zod_1.z.string({}).optional(),
        price: zod_1.z.number({}).optional(),
        image: zod_1.z.string({}).optional(),
        userId: zod_1.z.string({}).optional(),
        categoryId: zod_1.z.string({}).optional(),
    }),
});
exports.EventValidation = {
    createEventZodSchema,
    updateEventZodSchema,
};
