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
exports.BookingService = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createBooking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.create({
        data,
        include: {
            event: true,
        },
    });
    return result;
});
const getBookings = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const filtersData = __rest(filters, []);
    const andConditions = [];
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
    const result = yield prisma_1.default.booking.findMany({
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
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.booking.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getBookingsByUser = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const filtersData = __rest(filters, []);
    const andConditions = [];
    andConditions.push({
        AND: {
            userId: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    // andConditions.push({
    //   OR: [
    //     {
    //       status: BookingStatus.pending,
    //     },
    //     {
    //       status: BookingStatus.confirmed,
    //     },
    //   ],
    // });
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
    // @ts-ignore
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.booking.findMany({
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
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.booking.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    return result;
});
const updateBooking = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.update({
        where: {
            id,
        },
        data,
        include: {
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    return result;
});
const cancelBooking = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.update({
        where: {
            id,
            userId: user === null || user === void 0 ? void 0 : user.id,
        },
        data: {
            status: client_1.BookingStatus.canceled,
        },
        include: {
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    return result;
});
const deleteBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.BookingService = {
    createBooking,
    getBookings,
    getBookingsByUser,
    getSingleBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
};
