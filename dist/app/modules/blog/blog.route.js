"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const blog_validation_1 = require("./blog.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(blog_validation_1.BlogValidation.createBlogZodSchema), blog_controller_1.BlogController.createBlogController);
router.get('/user', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), blog_controller_1.BlogController.getBlogsByUserController);
router.get('/', 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
blog_controller_1.BlogController.getBlogsController);
router.get('/:id', 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
blog_controller_1.BlogController.getSingleBlogController);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(blog_validation_1.BlogValidation.updateBlogZodSchema), blog_controller_1.BlogController.updateBlogController);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), blog_controller_1.BlogController.deleteBlogController);
exports.BlogRoutes = router;
