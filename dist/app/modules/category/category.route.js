"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = require("./category.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.createOrUpdateCategoryZodSchema), category_controller_1.CategoryController.createCategoryController);
router.get('/', 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
category_controller_1.CategoryController.getCategoriesController);
router.get('/:id', 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
category_controller_1.CategoryController.getSingleCategoryController);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.createOrUpdateCategoryZodSchema), category_controller_1.CategoryController.updateCategoryController);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), category_controller_1.CategoryController.deleteCategoryController);
exports.CategoryRoutes = router;
