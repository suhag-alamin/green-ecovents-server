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
exports.FeedbackService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createFeedback = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.feedback.create({
        data,
    });
    return result;
});
const getFeedbacks = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.feedback.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: true,
        },
    });
    return result;
});
const getSingleFeedback = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.feedback.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    return result;
});
const updateFeedback = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.feedback.update({
        where: {
            id,
        },
        data,
        include: {
            user: true,
        },
    });
    return result;
});
const deleteFeedback = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.feedback.delete({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    return result;
});
const getFeedbacksByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.feedback.findMany({
        where: {
            userId,
        },
        include: {
            user: true,
        },
    });
    return result;
});
exports.FeedbackService = {
    createFeedback,
    getFeedbacks,
    getSingleFeedback,
    updateFeedback,
    deleteFeedback,
    getFeedbacksByUser,
};
