import express from 'express';
import { CategoryController } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategoryController,
);

export const CategoryRoutes = router;
