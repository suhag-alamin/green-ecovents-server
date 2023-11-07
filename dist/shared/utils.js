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
exports.sendMail = exports.asyncForEach = exports.excludePassword = exports.isPasswordMatch = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const transporter_1 = require("./transporter");
const config_1 = __importDefault(require("../config"));
const isPasswordMatch = (givenPassword, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(givenPassword, savedPassword);
});
exports.isPasswordMatch = isPasswordMatch;
const excludePassword = (user, keys) => {
    return Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key)));
};
exports.excludePassword = excludePassword;
const asyncForEach = (array, callback) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Array.isArray(array)) {
        throw new Error('Expected an array');
    }
    for (let i = 0; i < array.length; i++) {
        yield callback(array[i], i, array);
    }
});
exports.asyncForEach = asyncForEach;
const sendMail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = (0, transporter_1.getTransporter)();
    const mailOptions = {
        from: config_1.default.email.user,
        to: data.to,
        subject: data.subject,
        html: data.message,
    };
    const info = yield transporter.sendMail(mailOptions);
    if (!info) {
        throw new Error('Email not sent');
    }
    if (info.messageId) {
        return { sent: true };
    }
});
exports.sendMail = sendMail;
