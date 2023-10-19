"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoutes = void 0;
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("./event.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const event_validation_1 = require("./event.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(event_validation_1.EventValidation.createEventZodSchema), event_controller_1.EventController.createEventController);
router.get('/', 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
event_controller_1.EventController.getEventsController);
router.get('/:id', 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
event_controller_1.EventController.getSingleEventController);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(event_validation_1.EventValidation.updateEventZodSchema), event_controller_1.EventController.updateEventController);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), event_controller_1.EventController.deleteEventController);
exports.EventRoutes = router;
