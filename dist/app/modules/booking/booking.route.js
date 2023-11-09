"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const router = express_1.default.Router();
router.post('/create-payment-intents', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), 
// validateRequest(BookingValidation.createBookingZodSchema),
booking_controller_1.BookingController.createPaymentIntentsController);
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(booking_validation_1.BookingValidation.createBookingZodSchema), booking_controller_1.BookingController.createBookingController);
router.post('/confirm', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(booking_validation_1.BookingValidation.confirmBookingZodSchema), booking_controller_1.BookingController.confirmBookingController);
router.get('/payment-details/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), 
// validateRequest(BookingValidation.confirmBookingZodSchema),
booking_controller_1.BookingController.getPaymentDetailsController);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), booking_controller_1.BookingController.getBookingsController);
router.get('/user', (0, auth_1.default)(client_1.UserRole.USER), booking_controller_1.BookingController.getBookingsByUserController);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), booking_controller_1.BookingController.getSingleBookingController);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(booking_validation_1.BookingValidation.updateBookingZodSchema), booking_controller_1.BookingController.updateBookingController);
router.patch('/user/:id', (0, auth_1.default)(client_1.UserRole.USER), booking_controller_1.BookingController.cancelBookingController);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), booking_controller_1.BookingController.deleteBookingController);
exports.BookingRoutes = router;
