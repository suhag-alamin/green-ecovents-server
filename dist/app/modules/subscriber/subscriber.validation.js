"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriberValidation = void 0;
const zod_1 = require("zod");
const addSubscriberZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email address'),
    }),
});
const sendEmailToSubscribersZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        subject: zod_1.z.string({
            required_error: 'Subject is required',
        }),
        message: zod_1.z.any({
            required_error: 'Message is required',
        }),
    }),
});
exports.SubscriberValidation = {
    addSubscriberZodSchema,
    sendEmailToSubscribersZodSchema,
};
