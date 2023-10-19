"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const zod_1 = require("zod");
const createBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Blog name is required',
        }),
        content: zod_1.z.any({
            required_error: 'Content is required',
        }),
        userId: zod_1.z.string({
            required_error: 'User Id is required',
        }),
        image: zod_1.z.string({
            required_error: 'Image is required',
        }),
    }),
});
const updateBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({}).optional(),
        content: zod_1.z.any().optional(),
        image: zod_1.z.string({}).optional(),
    }),
});
exports.BlogValidation = {
    createBlogZodSchema,
    updateBlogZodSchema,
};
