"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validaiton_1 = require("./admin.validaiton");
const router = express_1.default.Router();
router.post('/make-admin', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(admin_validaiton_1.AdminValidation.makeAdminZodSchema), admin_controller_1.AdminController.makeAdminController);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(admin_validaiton_1.AdminValidation.updateAdminZodSchema), admin_controller_1.AdminController.updateAdminController);
router.get('/', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.getAdminsController);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.deleteAdminController);
exports.AdminRoutes = router;
