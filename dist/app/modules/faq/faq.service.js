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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createFaq = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fAQ.create({
        data,
    });
    return result;
});
const getFaqs = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fAQ.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return result;
});
const getSingleFaq = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fAQ.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateFaq = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fAQ.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteFaq = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fAQ.delete({
        where: {
            id,
        },
    });
    return result;
});
const getFaqsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fAQ.findMany({
        where: {
            userId,
        },
    });
    return result;
});
exports.FaqService = {
    createFaq,
    getFaqs,
    getSingleFaq,
    updateFaq,
    deleteFaq,
    getFaqsByUser,
};
