"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const user_constant_1 = require("./user.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    if (result === null || result === void 0 ? void 0 : result.email) {
        const newResult = (0, utils_1.excludePassword)(result, ['password']);
        return newResult;
    }
    return null;
});
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = filters, filtersData = __rest(filters, ["query"]);
    const andConditions = [];
    if (query) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map(field => ({
                [field]: {
                    contains: query,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => {
                return {
                    [key]: {
                        equals: filtersData[key],
                    },
                };
            }),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            blogPosts: true,
            FAQs: true,
            events: true,
        },
    });
    const total = yield prisma_1.default.user.count();
    const newResult = [];
    for (let i = 0; i < result.length; i++) {
        const user = result[i];
        const excludedUser = (0, utils_1.excludePassword)(user, ['password']);
        newResult.push(excludedUser);
    }
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: newResult,
    };
});
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (result === null || result === void 0 ? void 0 : result.email) {
        const newResult = (0, utils_1.excludePassword)(result, ['password']);
        return newResult;
    }
    return null;
});
const updateProfile = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        data,
    });
    if (result === null || result === void 0 ? void 0 : result.email) {
        const newResult = (0, utils_1.excludePassword)(result, ['password']);
        return newResult;
    }
    return null;
});
const updateUser = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data,
    });
    if (result === null || result === void 0 ? void 0 : result.email) {
        const newResult = (0, utils_1.excludePassword)(result, ['password']);
        return newResult;
    }
    return null;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isUserExist = yield transactionClient.user.findUnique({
            where: {
                id: userId,
                role: client_1.UserRole.USER,
            },
            include: {
                bookings: true,
                reviews: true,
            },
        });
        if (!isUserExist) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The user does not exist.');
        }
        // delete bookings by the user
        yield transactionClient.booking.deleteMany({
            where: {
                userId: isUserExist.id,
            },
        });
        // delete reviews by the user
        yield transactionClient.review.deleteMany({
            where: {
                userId: isUserExist.id,
            },
        });
        // delete feedback by the user
        yield transactionClient.feedback.deleteMany({
            where: {
                userId: isUserExist.id,
            },
        });
        const user = yield transactionClient.user.delete({
            where: {
                id: isUserExist.id,
            },
        });
        return user;
    }));
    if (result) {
        return result;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to delete user');
});
exports.UserService = {
    getProfile,
    getAllUsers,
    getUserById,
    updateProfile,
    updateUser,
    deleteUser,
};
