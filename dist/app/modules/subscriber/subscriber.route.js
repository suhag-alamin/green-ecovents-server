"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriberRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const subscriber_controller_1 = require("./subscriber.controller");
const subscriber_validation_1 = require("./subscriber.validation");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(subscriber_validation_1.SubscriberValidation.addSubscriberZodSchema), subscriber_controller_1.SubscriberController.addSubscriberController);
router.post('/send', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(subscriber_validation_1.SubscriberValidation.sendEmailToSubscribersZodSchema), subscriber_controller_1.SubscriberController.sendEmailToSubscribersController);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), subscriber_controller_1.SubscriberController.getSubscribersController);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), subscriber_controller_1.SubscriberController.deleteSubscriberController);
exports.SubscriberRoutes = router;
