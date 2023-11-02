"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailValidation = void 0;
const zod_1 = require("zod");
const sendMailZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        phone: zod_1.z.string({
            required_error: 'Phone is required',
        }),
        source: zod_1.z.string({
            required_error: 'Source is required',
        }),
        message: zod_1.z.string({
            required_error: 'Message is required',
        }),
    }),
});
exports.MailValidation = {
    sendMailZodSchema,
};
