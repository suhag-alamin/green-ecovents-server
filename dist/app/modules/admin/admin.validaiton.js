"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const makeAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        users: zod_1.z
            .object({
            email: zod_1.z.string().email('provide valid email'),
        })
            .array(),
    }),
});
const updateAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({}).optional(),
        lastName: zod_1.z.string({}).optional(),
        contactNo: zod_1.z.string({}).optional(),
        role: zod_1.z
            .enum([...Object.values(client_1.UserRole)], {})
            .optional(),
        gender: zod_1.z
            .enum([...Object.values(client_1.Gender)], {})
            .optional(),
    }),
});
exports.AdminValidation = {
    makeAdminZodSchema,
    updateAdminZodSchema,
};
