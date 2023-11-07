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
exports.SubscriberService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const subscriber_constant_1 = require("./subscriber.constant");
const utils_1 = require("../../../shared/utils");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const addSubscriber = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.subscriber.create({
        data,
    });
    return result;
});
const getSubscribers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = filters, filtersData = __rest(filters, ["query"]);
    const andConditions = [];
    if (query) {
        andConditions.push({
            OR: subscriber_constant_1.subscriberSearchableFields.map(field => ({
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
    const result = yield prisma_1.default.subscriber.findMany({
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
    });
    const total = yield prisma_1.default.subscriber.count({
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
const sendEmailToSubscribers = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const subscribers = yield prisma_1.default.subscriber.findMany();
    if (subscribers.length) {
        const result = yield (0, utils_1.sendMail)({
            to: subscribers.map(subscriber => subscriber.email),
            subject: data.subject,
            message: data.message,
        });
        if (!(result === null || result === void 0 ? void 0 : result.sent)) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Email not sent!');
        }
    }
});
const deleteSubscriber = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.subscriber.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.SubscriberService = {
    addSubscriber,
    getSubscribers,
    sendEmailToSubscribers,
    deleteSubscriber,
};
