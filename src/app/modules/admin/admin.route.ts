import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { AdminController } from './admin.controller';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN),
  AdminController.getAdminsController,
);

export const AdminRoutes = router;
