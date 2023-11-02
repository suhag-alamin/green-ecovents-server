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
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const category_constant_1 = require("./category.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.create({
        data,
        include: { events: true },
    });
    return result;
});
const getCategories = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = filters, filtersData = __rest(filters, ["query"]);
    const andConditions = [];
    if (query) {
        andConditions.push({
            OR: category_constant_1.categorySearchableFields.map(field => ({
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
    const result = yield prisma_1.default.category.findMany({
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
        include: { events: true },
    });
    const total = yield prisma_1.default.category.count({
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
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
        include: { events: true },
    });
    return result;
});
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.update({
        where: {
            id,
        },
        data,
        include: { events: true },
    });
    return result;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isCategoryExist = yield transactionClient.category.findUnique({
            where: {
                id,
            },
            include: {
                events: true,
            },
        });
        if (!isCategoryExist) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The category does not exist.');
        }
        // delete events by the category
        yield transactionClient.event.deleteMany({
            where: {
                categoryId: isCategoryExist.id,
            },
        });
        const category = yield transactionClient.category.delete({
            where: {
                id: isCategoryExist.id,
            },
        });
        return category;
    }));
    if (result) {
        return result;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to delete category');
});
exports.CategoryService = {
    createCategory,
    getCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
