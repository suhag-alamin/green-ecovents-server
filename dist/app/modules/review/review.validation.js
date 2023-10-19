"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        review: zod_1.z.string({
            required_error: 'Review is required',
        }),
        rating: zod_1.z
            .number({
            required_error: 'Rating is required',
        })
            .max(5)
            .min(1),
        userId: zod_1.z.string({
            required_error: 'User Id is required',
        }),
        eventId: zod_1.z.string({
            required_error: 'Event Id is required',
        }),
    }),
});
const updateReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        review: zod_1.z.string({}).optional(),
        rating: zod_1.z.number({}).max(5).min(1).optional(),
        userId: zod_1.z.string({}).optional(),
        eventId: zod_1.z.string({}).optional(),
    }),
});
exports.ReviewValidation = {
    createReviewZodSchema,
    updateReviewZodSchema,
};
