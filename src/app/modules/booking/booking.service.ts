/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Booking, BookingStatus, Prisma } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { sendMail } from '../../../shared/utils';
import { IBookingFilters } from './booking.interface';
import config from '../../../config';
import Stripe from 'stripe';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createPaymentIntents = async (data: any) => {
  const stripe = new Stripe(config.stripe.secret_key as string);
  const paymentIntent: Stripe.Response<Stripe.PaymentIntent> =
    await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      payment_method_types: ['card'],
      receipt_email: data.email,
    });

  return {
    paymentId: paymentIntent.id,
    currency: paymentIntent.currency,
    amount: paymentIntent.amount / 100,
    clientSecret: paymentIntent.client_secret,
  };
};

const createBooking = async (data: Booking): Promise<Booking> => {
  const result = await prisma.booking.create({
    data,
    include: {
      event: true,
      user: true,
    },
  });

  // if (result.id) {
  //   await sendMail({
  //     subject: `Booking Confirmation of - ${result.event?.title}`,
  //     to: result.email,
  //     message: `
  //     <h1>Confirmation of Your Event Booking</h1>
  //     <p> <strong>Dear ${result.user?.firstName}</strong> ,</p>
  //     <p>We are thrilled to inform you that your event booking has been successfully confirmed! Thank you for choosing GreenEcovents to be a part of your special day.</p>
  //     <h3>Event Details:</h3>
  //     <p><strong>Event Name:</strong> ${result.event?.title}</p>
  //     <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
  //     <p><strong>Location:</strong>: ${result.event?.location}</p>
  //     <p><strong>Your Booking ID:</strong>: ${result.id}</p>
  //     <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com.</p>
  //     <p>We look forward to hosting you and ensuring that your event is a memorable experience. Stay tuned for further updates and information as the event date approaches.</p>
  //     <p>Best regards,</p>
  //     <p>GreenEcovents</p>
  //     `,
  //   });
  // }

  return result;
};
const confirmBooking = async (data: any): Promise<Booking> => {
  console.log('hiitinng', data);
  // const result = await prisma.booking.create({
  //   data,
  //   include: {
  //     event: true,
  //     user: true,
  //   },
  // });

  // if (result.id) {
  //   await sendMail({
  //     subject: `Booking Confirmation of - ${result.event?.title}`,
  //     to: result.email,
  //     message: `
  //     <h1>Confirmation of Your Event Booking</h1>
  //     <p> <strong>Dear ${result.user?.firstName}</strong> ,</p>
  //     <p>We are thrilled to inform you that your event booking has been successfully confirmed! Thank you for choosing GreenEcovents to be a part of your special day.</p>
  //     <h3>Event Details:</h3>
  //     <p><strong>Event Name:</strong> ${result.event?.title}</p>
  //     <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
  //     <p><strong>Location:</strong>: ${result.event?.location}</p>
  //     <p><strong>Your Booking ID:</strong>: ${result.id}</p>
  //     <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com.</p>
  //     <p>We look forward to hosting you and ensuring that your event is a memorable experience. Stay tuned for further updates and information as the event date approaches.</p>
  //     <p>Best regards,</p>
  //     <p>GreenEcovents</p>
  //     `,
  //   });
  // }

  // return result;

  const result = await prisma.$transaction(async transactionClient => {
    await transactionClient.payment.create({ data });

    const booking = await transactionClient.booking.update({
      where: {
        id: data.bookingId,
      },
      data: {
        status: BookingStatus.confirmed,
      },
      include: {
        event: true,
        user: true,
      },
    });

    if (booking.id) {
      await sendMail({
        subject: `Booking Confirmation of - ${booking.event?.title}`,
        to: booking.email,
        message: `
        <h1>Confirmation of Your Event Booking</h1>
        <p> <strong>Dear ${booking.user?.firstName}</strong> ,</p>
        <p>We are thrilled to inform you that your event booking has been successfully confirmed! Thank you for choosing GreenEcovents to be a part of your special day.</p>
        <h3>Event Details:</h3>
        <p><strong>Event Name:</strong> ${booking.event?.title}</p>
        <p><strong>Date:</strong>: From ${booking.startDate} to ${booking.endDate} </p>
        <p><strong>Location:</strong>: ${booking.event?.location}</p>
        <p><strong>Your Booking ID:</strong>: ${booking.id}</p>
        <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com.</p>
        <p>We look forward to hosting you and ensuring that your event is a memorable experience. Stay tuned for further updates and information as the event date approaches.</p>
        <p>Best regards,</p>
        <p>GreenEcovents</p>
        `,
      });
    }

    return booking;
  });

  if (result) {
    return result;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to confirm booking.');
};

const getReceipt = async (paymentIntentId: string) => {
  const stripe = new Stripe(config.stripe.secret_key as string);
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
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

  if (data.status && result.id) {
    if (
      data.status === BookingStatus.confirmed ||
      data.status === BookingStatus.pending
    ) {
      await sendMail({
        subject: `Booking Status Update of - ${result.event?.title}`,
        to: result.email,
        message: `
      <h1>Booking Status Update of - ${result.event?.title}</h1>
      <p> <strong>Dear ${result.user?.firstName}</strong> ,</p>
      <p>We are writing to inform you that the status of your event booking has been updated to <strong>${result.status}</strong>! Thank you for choosing GreenEcovents to be a part of your special day.</p>
      <h3>Event Details:</h3>
      <p><strong>Event Name:</strong> ${result.event?.title}</p>
      <p><strong>Booking Status:</strong> ${result?.status}</p>
      <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
      <p><strong>Location:</strong>: ${result.event?.location}</p>
      <p><strong>Your Booking ID:</strong>: ${result.id}</p>
      <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com </p>
      <p>Best regards,</p>
      <p>GreenEcovents</p>
      `,
      });
    } else if (data.status === BookingStatus.canceled) {
      await sendMail({
        subject: `Booking Cancellation of - ${result.event?.title}`,
        to: result.email,
        message: `
      <h1>Cancellation of Your Event Booking</h1>
      <p> <strong>Dear ${result.user?.firstName}</strong> ,</p>
      <p>We are sorry to inform you that your event booking has been cancelled! Thank you for choosing GreenEcovents to be a part of your special day.</p>
      <h3>Event Details:</h3>
      <p><strong>Event Name:</strong> ${result.event?.title}</p>
      <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
      <p><strong>Location:</strong>: ${result.event?.location}</p>
      <p><strong>Your Booking ID:</strong>: ${result.id}</p>
      <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com</p>
      <p>Best regards,</p>
      <p>GreenEcovents</p>
      `,
      });
    }
  }

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

  if (result.id) {
    await sendMail({
      subject: `Booking Cancellation of - ${result.event?.title}`,
      to: result.email,
      message: `
      <h1>Cancellation of Your Event Booking</h1>
      <p> <strong>Dear ${result.user?.firstName}</strong> ,</p>
      <p>We are sorry to inform you that your event booking has been cancelled! Thank you for choosing GreenEcovents to be a part of your special day.</p>
      <h3>Event Details:</h3>
      <p><strong>Event Name:</strong> ${result.event?.title}</p>
      <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
      <p><strong>Location:</strong>: ${result.event?.location}</p>
      <p><strong>Your Booking ID:</strong>: ${result.id}</p>
      <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com</p>
      <p>Best regards,</p>
      <p>GreenEcovents</p>
      `,
    });
  }

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
  createPaymentIntents,
  createBooking,
  confirmBooking,
  getReceipt,
  getBookings,
  getBookingsByUser,
  getSingleBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
};
