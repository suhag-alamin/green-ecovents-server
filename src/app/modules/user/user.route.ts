import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
const router = express.Router();

router.get(
  '/profile',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  UserController.getProfileController,
);

router.patch(
  '/profile',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateProfileController,
);

export const UserRoutes = router;
