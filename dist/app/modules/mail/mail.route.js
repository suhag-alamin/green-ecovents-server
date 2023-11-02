"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mail_controller_1 = require("./mail.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const mail_validation_1 = require("./mail.validation");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(mail_validation_1.MailValidation.sendMailZodSchema), mail_controller_1.MailController.sendMailController);
exports.MailRoutes = router;
