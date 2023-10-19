"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({}).optional(),
        lastName: zod_1.z.string({}).optional(),
        contactNo: zod_1.z.string({}).optional(),
        profileImg: zod_1.z.string({}).optional(),
        gender: zod_1.z
            .enum([...Object.values(client_1.Gender)])
            .optional(),
    }),
});
exports.UserValidation = {
    updateUserZodSchema,
};
