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
exports.EventService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const event_constant_1 = require("./event.constant");
const createEvent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.event.create({
        data,
        include: {
            bookings: true,
            categories: true,
            reviews: true,
        },
    });
    return result;
});
const getEvents = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = filters, filtersData = __rest(filters, ["query"]);
    const andConditions = [];
    if (query) {
        andConditions.push({
            OR: event_constant_1.eventSearchableFields.map(field => ({
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
    const result = yield prisma_1.default.event.findMany({
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
            bookings: true,
            categories: true,
            reviews: true,
        },
    });
    const total = yield prisma_1.default.event.count({
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
const getSingleEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.event.findUnique({
        where: {
            id,
        },
        include: {
            bookings: true,
            categories: true,
            reviews: {
                include: {
                    user: true,
                },
            },
        },
    });
    return result;
});
const updateEvent = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.event.update({
        where: {
            id,
        },
        data,
        include: {
            bookings: true,
            categories: true,
            reviews: true,
        },
    });
    return result;
});
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isEventExist = yield transactionClient.event.findUnique({
            where: {
                id,
            },
            include: {
                bookings: true,
                reviews: true,
            },
        });
        if (!isEventExist) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The event does not exist.');
        }
        // delete bookings by the category
        yield transactionClient.booking.deleteMany({
            where: {
                eventId: isEventExist.id,
            },
        });
        // delete reviews by the category
        yield transactionClient.review.deleteMany({
            where: {
                eventId: isEventExist.id,
            },
        });
        const event = yield transactionClient.event.delete({
            where: {
                id: isEventExist.id,
            },
        });
        return event;
    }));
    if (result) {
        return result;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to delete event');
});
exports.EventService = {
    createEvent,
    getEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,
};
