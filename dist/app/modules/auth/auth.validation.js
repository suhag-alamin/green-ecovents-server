"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const signupZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email address is required',
        })
            .email({
            message: 'Use valid email address',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
        firstName: zod_1.z.string({
            required_error: 'First name is required',
        }),
        lastName: zod_1.z.string({
            required_error: 'Last name is required',
        }),
        contactNo: zod_1.z.string({
            required_error: 'Contact number is required',
        }),
        role: zod_1.z
            .enum([...Object.values(client_1.UserRole)], {
            required_error: 'User role is required',
        })
            .default(client_1.UserRole.USER),
        gender: zod_1.z.enum([...Object.values(client_1.Gender)], {
            required_error: 'Gender is required',
        }),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email address is required',
        })
            .email({
            message: 'Use valid email address',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});
const changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: 'Current password is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New password is required',
        }),
    }),
});
exports.AuthValidation = {
    signupZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
    changePasswordZodSchema,
};
