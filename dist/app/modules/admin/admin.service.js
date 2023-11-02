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
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const admin_constant_1 = require("./admin.constant");
const getAdmins = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = filters, filtersData = __rest(filters, ["query"]);
    const andConditions = [];
    andConditions.push({
        AND: {
            role: client_1.UserRole.ADMIN,
        },
    });
    if (query) {
        andConditions.push({
            OR: admin_constant_1.adminSearchableFields.map(field => ({
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
    const total = yield prisma_1.default.user.count({
        where: whereConditions,
    });
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
const makeAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data === null || data === void 0 ? void 0 : data.users.length) {
            yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, utils_1.asyncForEach)(data === null || data === void 0 ? void 0 : data.users, (user) => __awaiter(void 0, void 0, void 0, function* () {
                    const isUserExist = yield transactionClient.user.findUnique({
                        where: {
                            email: user.email,
                        },
                    });
                    if (!isUserExist) {
                        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The user does not exist, to make admin, you must register first.');
                    }
                    const makeAdmin = yield transactionClient.user.update({
                        where: {
                            email: user.email,
                        },
                        data: {
                            role: client_1.UserRole.ADMIN,
                        },
                    });
                    return makeAdmin;
                }));
            }));
        }
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to make admin');
    }
    // const { userId } = data;
    // const result = await prisma.$transaction(async transactionClient => {
    //   const isUserExist = await transactionClient.user.findUnique({
    //     where: {
    //       id: userId,
    //       role: UserRole.USER,
    //     },
    //   });
    //   if (!isUserExist) {
    //     throw new ApiError(
    //       httpStatus.BAD_REQUEST,
    //       'The user does not exist, to make admin, you must register first.',
    //     );
    //   }
    //   const makeAdmin = await transactionClient.user.update({
    //     where: {
    //       id: userId,
    //     },
    //     data: {
    //       role: UserRole.ADMIN,
    //     },
    //   });
    //   return makeAdmin;
    // });
    // if (result) {
    //   const newResult = excludePassword(result, ['password']);
    //   return newResult;
    // }
    // throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to make admin');
});
const deleteAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isUserExist = yield transactionClient.user.findUnique({
            where: {
                id: userId,
                role: client_1.UserRole.ADMIN,
            },
            include: {
                blogPosts: true,
                events: true,
                FAQs: true,
            },
        });
        if (!isUserExist) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The user does not exist.');
        }
        yield transactionClient.event.deleteMany({
            where: {
                userId: isUserExist.id,
            },
        });
        yield transactionClient.blogPost.deleteMany({
            where: {
                userId: isUserExist.id,
            },
        });
        // delete faqs by the user
        yield transactionClient.fAQ.deleteMany({
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
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to delete admin');
});
const updateAdmin = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            role: client_1.UserRole.ADMIN,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The user does not exist.');
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id: userId,
            role: client_1.UserRole.ADMIN,
        },
        data,
    });
    const newResult = (0, utils_1.excludePassword)(result, ['password']);
    return newResult;
});
exports.AdminService = {
    getAdmins,
    makeAdmin,
    deleteAdmin,
    updateAdmin,
};
