import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { UserController } from './user.controller';
const router = express.Router();

router.get(
  '/profile',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  UserController.getProfileController,
);

export const UserRoutes = router;
