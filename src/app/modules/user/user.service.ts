import { User, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { excludePassword } from '../../../shared/utils';

const getProfile = async (
  user: JwtPayload | null,
): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (result?.email) {
    const newResult = excludePassword(result, ['password']);

    return newResult;
  }
  return null;
};
const updateProfile = async (
  user: JwtPayload | null,
  data: Partial<User>,
): Promise<Partial<User> | null> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.user.update({
    where: {
      id: user?.id,
    },
    data,
  });

  if (result?.email) {
    const newResult = excludePassword(result, ['password']);

    return newResult;
  }
  return null;
};

const deleteUser = async (userId: string): Promise<User | null> => {
  const result = await prisma.$transaction(async transactionClient => {
    const isUserExist = await transactionClient.user.findUnique({
      where: {
        id: userId,
        role: UserRole.USER,
      },
      include: {
        bookings: true,
        reviews: true,
      },
    });

    if (!isUserExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The user does not exist.');
    }

    // delete bookings by the user
    await transactionClient.booking.deleteMany({
      where: {
        userId: isUserExist.id,
      },
    });

    // delete reviews by the user
    await transactionClient.review.deleteMany({
      where: {
        userId: isUserExist.id,
      },
    });

    const user = await transactionClient.user.delete({
      where: {
        id: isUserExist.id,
      },
    });

    return user;
  });
  if (result) {
    return result;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to delete user');
};

export const UserService = {
  getProfile,
  updateProfile,
  deleteUser,
};
