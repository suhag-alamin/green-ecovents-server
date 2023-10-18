import { Booking } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookingFilterableFields } from './booking.constant';
import { BookingService } from './booking.service';

const createBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.createBooking(req.body);

    sendResponse<Booking>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking created successfully!',
      data: result,
    });
  },
);
const getBookingsController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, bookingFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await BookingService.getBookings(filters, paginationOptions);

    sendResponse<Booking[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bookings retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getBookingsByUserController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, bookingFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const user = req.user;

    const result = await BookingService.getBookingsByUser(
      filters,
      paginationOptions,
      user,
    );

    sendResponse<Booking[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bookings retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getSingleBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.getSingleBooking(req.params.id);

    sendResponse<Booking | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking retrieved successfully!',
      data: result,
    });
  },
);

const updateBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.updateBooking(req.params.id, req.body);

    sendResponse<Booking>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking updated successfully!',
      data: result,
    });
  },
);
const cancelBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await BookingService.cancelBooking(req.params.id, user);

    sendResponse<Booking>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking canceled successfully!',
      data: result,
    });
  },
);

const deleteBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.deleteBooking(req.params.id);

    sendResponse<Booking | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking deleted successfully!',
      data: result,
    });
  },
);

export const BookingController = {
  createBookingController,
  getBookingsController,
  getBookingsByUserController,
  getSingleBookingController,
  updateBookingController,
  cancelBookingController,
  deleteBookingController,
};
