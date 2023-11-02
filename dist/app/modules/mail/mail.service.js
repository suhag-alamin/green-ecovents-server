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
exports.MailService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: config_1.default.email.user,
            pass: config_1.default.email.pass,
        },
    });
    const mailOptions = {
        from: data.email,
        to: config_1.default.email.to_email,
        subject: `New message from GreenEcovents by - ${data.name}`,
        html: `
      <h1>New message from GreenEcovents</h1>
      <p><strong>User Name:</strong> ${data.name}</p>
      <p><strong>User Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Source:</strong> ${data.source}</p>
      <p><strong>Message:</strong> ${data.message}</p>
    `,
    };
    const info = yield transporter.sendMail(mailOptions);
    if (!info) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Email not sent');
    }
    if (info.messageId) {
        return { sent: true };
    }
});
exports.MailService = { sendMail };
