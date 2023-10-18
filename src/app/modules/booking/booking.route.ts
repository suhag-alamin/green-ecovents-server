import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { BookingValidation } from './event.validation';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(BookingValidation.createBookingZodSchema),
  BookingController.createBookingController,
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  BookingController.getBookingsController,
);
router.get(
  '/user',
  auth(UserRole.USER),
  BookingController.getBookingsByUserController,
);
router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  BookingController.getSingleBookingController,
);
router.patch(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(BookingValidation.updateBookingZodSchema),
  BookingController.updateBookingController,
);
router.patch(
  '/user/:id',
  auth(UserRole.USER),
  BookingController.cancelBookingController,
);
router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  BookingController.deleteBookingController,
);

export const BookingRoutes = router;
