"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackValidation = void 0;
const zod_1 = require("zod");
const createFeedbackZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        feedback: zod_1.z.string({
            required_error: 'Feedback is required',
        }),
        userId: zod_1.z.string({
            required_error: 'User Id is required',
        }),
    }),
});
const updateFeedbackZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        feedback: zod_1.z.string({}).optional(),
    }),
});
exports.FeedbackValidation = {
    createFeedbackZodSchema,
    updateFeedbackZodSchema,
};
