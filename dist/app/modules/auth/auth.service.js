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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const signup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    data.password = yield bcrypt_1.default.hash(data.password, Number(config_1.default.bycrypt_salt_rounds));
    const result = yield prisma_1.default.user.create({
        data,
    });
    const newResult = (0, utils_1.excludePassword)(result, ['password']);
    return newResult;
});
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    // check if user exist
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            password: true,
            role: true,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check password
    if (isUserExist.password &&
        !(yield (0, utils_1.isPasswordMatch)(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password does not match');
    }
    const { id, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify token
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid refresh token');
    }
    // checking deleted users refresh token
    const { id } = verifiedToken;
    // check if user exist
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            role: true,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ id: isUserExist.id, role: isUserExist.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = payload;
    // check if user exist
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        select: {
            id: true,
            password: true,
            role: true,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check password
    if (isUserExist.password &&
        !(yield (0, utils_1.isPasswordMatch)(currentPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Current Password is incorrect');
    }
    // check password
    if (isUserExist.password &&
        (yield (0, utils_1.isPasswordMatch)(newPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Current password can not be same as old password!');
    }
    isUserExist.password = newPassword;
    const newHashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_salt_rounds));
    const result = yield prisma_1.default.user.update({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        data: {
            password: newHashPassword,
        },
    });
    const newResult = (0, utils_1.excludePassword)(result, ['password']);
    return newResult;
});
exports.AuthService = {
    signup,
    login,
    refreshToken,
    changePassword,
};
