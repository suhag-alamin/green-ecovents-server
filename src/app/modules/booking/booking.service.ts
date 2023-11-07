/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Booking, BookingStatus, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IBookingFilters } from './booking.interface';
import { JwtPayload } from 'jsonwebtoken';
import { sendMail } from '../../../shared/utils';

const createBooking = async (data: Booking): Promise<Booking> => {
  const result = await prisma.booking.create({
    data,
    include: {
      event: true,
      user: true,
    },
  });

  if (result.id) {
    await sendMail({
      subject: `Booking Confirmation of - ${result.event?.title}`,
      to: result.email,
      message: `
      <h1>Confirmation of Your Event Booking</h1>
      <p> <strong>Dear ${result.user?.firstName}</strong> ,</p>
      <p>We are thrilled to inform you that your event booking has been successfully confirmed! Thank you for choosing GreenEcovents to be a part of your special day.</p>
      <h3>Event Details:</h3>
      <p><strong>Event Name:</strong> ${result.event?.title}</p>
      <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
      <p><strong>Location:</strong>: ${result.event?.location}</p>
      <p><strong>Your Booking ID:</strong>: ${result.id}</p>
      <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com.</p>
      <p>We look forward to hosting you and ensuring that your event is a memorable experience. Stay tuned for further updates and information as the event date approaches.</p>
      <p>Best regards,</p>
      <p>GreenEcovents</p>
      `,
    });
  }

  return result;
};

const getBookings = async (
  filters: IBookingFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Booking[]>> => {
  const { ...filtersData } = filters;

  const andConditions = [];

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        return {
          [key]: {
            equals: (filtersData as any)[key],
          },
        };
      }),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const whereConditions: Prisma.BookingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include: {
      user: true,
      event: {
        include: {
          categories: true,
          reviews: true,
        },
      },
    },
  });
  const total = await prisma.booking.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getBookingsByUser = async (
  filters: IBookingFilters,
  paginationOptions: IPaginationOptions,
  user: JwtPayload | null,
): Promise<IGenericResponse<Booking[]>> => {
  const { ...filtersData } = filters;

  const andConditions = [];

  andConditions.push({
    AND: {
      userId: user?.id,
    },
  });
  // andConditions.push({
  //   OR: [
  //     {
  //       status: BookingStatus.pending,
  //     },
  //     {
  //       status: BookingStatus.confirmed,
  //     },
  //   ],
  // });

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        return {
          [key]: {
            equals: (filtersData as any)[key],
          },
        };
      }),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  // @ts-ignore
  const whereConditions: Prisma.BookingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include: {
      user: true,
      event: {
        include: {
          categories: true,
          reviews: true,
        },
      },
    },
  });
  const total = await prisma.booking.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleBooking = async (id: string): Promise<Booking | null> => {
  const result = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      event: {
        include: {
          categories: true,
          reviews: true,
        },
      },
    },
  });
  return result;
};

const updateBooking = async (
  id: string,
  data: Booking,
): Promise<Booking | null> => {
  const result = await prisma.booking.update({
    where: {
      id,
    },
    data,
    include: {
      user: true,
      event: {
        include: {
          categories: true,
          reviews: true,
        },
      },
    },
  });
  return result;
};
const cancelBooking = async (
  id: string,
  user: JwtPayload | null,
): Promise<Booking | null> => {
  const result = await prisma.booking.update({
    where: {
      id,
      userId: user?.id,
    },
    data: {
      status: BookingStatus.canceled,
    },
    include: {
      user: true,
      event: {
        include: {
          categories: true,
          reviews: true,
        },
      },
    },
  });

  return result;
};

const deleteBooking = async (id: string): Promise<Booking | null> => {
  const result = await prisma.booking.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BookingService = {
  createBooking,
  getBookings,
  getBookingsByUser,
  getSingleBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
};
